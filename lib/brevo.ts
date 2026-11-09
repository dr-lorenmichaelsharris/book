type PreorderContact = {
  name: string;
  email: string;
  quantity: number;
  source: string;
  updatesConsent: boolean;
};

export type BrevoSyncResult = {
  preorderSaved: true;
  updatesConfirmationSent: boolean;
};

export class BrevoSyncError extends Error {
  readonly preorderSaved: boolean;

  constructor(message: string, preorderSaved: boolean) {
    super(message);
    this.name = "BrevoSyncError";
    this.preorderSaved = preorderSaved;
  }
}

function requiredInteger(name: string): number {
  const value = process.env[name];
  if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new BrevoSyncError(`Missing or invalid ${name}`, false);
  }
  return Number(value);
}

function contactAttributes(contact: PreorderContact): Record<string, string | number | boolean> {
  const attributes: Record<string, string | number | boolean> = { FNAME: contact.name };
  const quantityAttribute = process.env.BREVO_QUANTITY_ATTRIBUTE;
  const sourceAttribute = process.env.BREVO_SOURCE_ATTRIBUTE;

  for (const [name, value] of [
    [quantityAttribute, contact.quantity] as const,
    [sourceAttribute, contact.source] as const,
  ]) {
    if (!name) continue;
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) {
      throw new BrevoSyncError("Invalid Brevo contact attribute configuration", false);
    }
    attributes[name.toUpperCase()] = value;
  }
  return attributes;
}

async function brevoRequest(path: string, body: object): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new BrevoSyncError("Brevo API is not configured", false);

  let response: Response;
  try {
    response = await fetch(`https://api.brevo.com/v3/${path}`, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new BrevoSyncError("Brevo API request failed", false);
  }

  if (!response.ok) {
    throw new BrevoSyncError(`Brevo API returned ${response.status}`, path === "contacts/doubleOptinConfirmation");
  }
}

export async function syncPreorderToBrevo(contact: PreorderContact): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new BrevoSyncError("Brevo API is not configured", false);
  const preorderListId = requiredInteger("BREVO_PREORDER_LIST_ID");
  const attributes = contactAttributes(contact);

  try {
    await brevoRequest("contacts", {
      email: contact.email,
      attributes,
      listIds: [preorderListId],
      updateEnabled: true,
    });
  } catch (error) {
    if (error instanceof BrevoSyncError) throw error;
    throw new BrevoSyncError("Could not save preorder contact in Brevo", false);
  }

  if (!contact.updatesConsent) return { preorderSaved: true, updatesConfirmationSent: false };

  try {
    const updatesListId = requiredInteger("BREVO_BOOK_UPDATES_LIST_ID");
    if (updatesListId === preorderListId) {
      throw new BrevoSyncError("Preorder and book updates lists must be different", true);
    }
    const templateId = requiredInteger("BREVO_DOI_TEMPLATE_ID");
    await brevoRequest("contacts/doubleOptinConfirmation", {
      email: contact.email,
      includeListIds: [updatesListId],
      redirectionUrl: "https://fromsplinteredtocentered.com/preorder/confirmed",
      templateId,
      attributes,
    });
  } catch (error) {
    throw new BrevoSyncError(
      error instanceof BrevoSyncError ? error.message : "Could not send Brevo confirmation",
      true,
    );
  }

  return { preorderSaved: true, updatesConfirmationSent: true };
}
