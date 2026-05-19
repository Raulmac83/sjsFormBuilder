export type ScreenSlotType = 'single' | 'grid';

export type ScreenSlot = {
  id: string;
  name: string;
  type: ScreenSlotType;
  formIds: string[];
};

export type ScreenDefinition = {
  id: string;
  name: string;
  updatedAt: number;
  slots: ScreenSlot[];
};

let _screens: ScreenDefinition[] = [];

const normalizeSlot = (slot: ScreenSlot): ScreenSlot => {
  if (slot.type === 'single') {
    return {
      ...slot,
      formIds: slot.formIds.slice(0, 1),
    };
  }
  return slot;
};

export const listScreens = (): ScreenDefinition[] =>
  [..._screens].sort((a, b) => b.updatedAt - a.updatedAt);

export const getScreen = (id: string): ScreenDefinition | undefined =>
  _screens.find((s) => s.id === id);

export const createScreen = (name: string): ScreenDefinition => {
  const trimmed = name.trim() || 'Untitled screen';
  const screen: ScreenDefinition = {
    id: crypto.randomUUID(),
    name: trimmed,
    updatedAt: Date.now(),
    slots: [],
  };
  _screens = [screen, ..._screens];
  return screen;
};

export const renameScreen = (id: string, name: string): void => {
  _screens = _screens.map((s) =>
    s.id === id
      ? {
          ...s,
          name: name.trim() || s.name,
          updatedAt: Date.now(),
        }
      : s,
  );
};

export const deleteScreen = (id: string): void => {
  _screens = _screens.filter((s) => s.id !== id);
};

export const addScreenSlot = (
  screenId: string,
  input: { name: string; type: ScreenSlotType },
): ScreenSlot | undefined => {
  const slot: ScreenSlot = {
    id: crypto.randomUUID(),
    name: input.name.trim() || 'Untitled section',
    type: input.type,
    formIds: [],
  };

  let created = false;
  _screens = _screens.map((s) => {
    if (s.id !== screenId) return s;
    created = true;
    return {
      ...s,
      updatedAt: Date.now(),
      slots: [...s.slots, slot],
    };
  });
  return created ? slot : undefined;
};

export const updateScreenSlot = (
  screenId: string,
  slotId: string,
  patch: Partial<Pick<ScreenSlot, 'name' | 'type' | 'formIds'>>,
): void => {
  _screens = _screens.map((s) => {
    if (s.id !== screenId) return s;
    return {
      ...s,
      updatedAt: Date.now(),
      slots: s.slots.map((slot) => {
        if (slot.id !== slotId) return slot;
        const next: ScreenSlot = normalizeSlot({
          ...slot,
          ...patch,
          formIds: patch.formIds ?? slot.formIds,
        });
        return next;
      }),
    };
  });
};

export const removeScreenSlot = (screenId: string, slotId: string): void => {
  _screens = _screens.map((s) =>
    s.id === screenId
      ? {
          ...s,
          updatedAt: Date.now(),
          slots: s.slots.filter((slot) => slot.id !== slotId),
        }
      : s,
  );
};
