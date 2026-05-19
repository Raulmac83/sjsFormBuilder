export type FormStatus = 'draft' | 'live';

export type FormDefinition = {
  id: string;
  name: string;
  status: FormStatus;
  version: number;
  /** ID of the earliest ancestor form this was versioned from */
  parentId?: string;
  updatedAt: number;
  json: Record<string, unknown>;
};

// ─── In-memory store — data lives only while the app is running ───────────────
let _store: FormDefinition[] = [];

const emptySurveyJson = (title: string): Record<string, unknown> => ({
  title,
  pages: [{ name: 'page1', elements: [] }],
});

export const listForms = (): FormDefinition[] =>
  [..._store].sort((a, b) => b.updatedAt - a.updatedAt);

export const getForm = (id: string): FormDefinition | undefined =>
  _store.find((f) => f.id === id);

export const createForm = (name: string): FormDefinition => {
  const trimmed = name.trim() || 'Untitled form';
  const form: FormDefinition = {
    id: crypto.randomUUID(),
    name: trimmed,
    status: 'draft',
    version: 1,
    updatedAt: Date.now(),
    json: emptySurveyJson(trimmed),
  };
  _store = [form, ..._store];
  return form;
};

export const renameForm = (id: string, name: string): void => {
  _store = _store.map((f) =>
    f.id === id && f.status === 'draft'
      ? { ...f, name: name.trim() || f.name, updatedAt: Date.now() }
      : f,
  );
};

export const saveFormJson = (
  id: string,
  json: Record<string, unknown>,
): void => {
  _store = _store.map((f) =>
    f.id === id && f.status === 'draft'
      ? { ...f, json, updatedAt: Date.now() }
      : f,
  );
};

export const deleteForm = (id: string): void => {
  _store = _store.filter((f) => f.id !== id);
};

/** Move a draft form to live. Live forms cannot be edited. */
export const publishForm = (id: string): void => {
  _store = _store.map((f) =>
    f.id === id && f.status === 'draft'
      ? { ...f, status: 'live', updatedAt: Date.now() }
      : f,
  );
};

/**
 * Create a new draft version from a live form.
 * The new version inherits the same name, JSON, and lineage but starts editable.
 */
export const createNewVersion = (id: string): FormDefinition | undefined => {
  const source = _store.find((f) => f.id === id);
  if (!source) return undefined;
  const newForm: FormDefinition = {
    id: crypto.randomUUID(),
    name: source.name,
    status: 'draft',
    version: source.version + 1,
    parentId: source.parentId ?? source.id,
    updatedAt: Date.now(),
    json: structuredClone(source.json),
  };
  _store = [newForm, ..._store];
  return newForm;
};
