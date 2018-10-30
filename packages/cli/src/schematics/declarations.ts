export interface Schematic<T = any> {
    name: string;
    actions: (opts: T) => Action[];
}

export type Action = CreateAction | AppendAction | ReplaceAction | DeleteAction | ActionBase;

type ActionType = 'create' | 'append' | 'delete' | 'replace' | 'json-update';

interface ActionBase {
    type: ActionType;
    path: string | string[];
}

export interface CreateAction extends ActionBase {
    type: 'create';
    file?: boolean;
    dir?: boolean;
    sourceText?: string;
}

export interface AppendAction extends ActionBase {
    type: 'append';
    sourceText?: string;
}

export interface JSONUpdateAction extends ActionBase {
    type: 'json-update';
    data?: any;
}

export interface ReplaceAction extends ActionBase {
    type: 'replace';
    find?: string | RegExp;
    replace?: string;
}

export interface DeleteAction extends ActionBase {
    type: 'delete';
}

export const isCreateAction = (action: ActionBase): action is CreateAction => action.type === 'create';
export const isAppendAction = (action: ActionBase): action is AppendAction => action.type === 'append';
export const isJSONUpdateAction = (action: ActionBase): action is JSONUpdateAction => action.type === 'json-update';
export const isReplaceAction = (action: ActionBase): action is ReplaceAction => action.type === 'replace';
export const isDeleteAction = (action: ActionBase): action is DeleteAction => action.type === 'delete';