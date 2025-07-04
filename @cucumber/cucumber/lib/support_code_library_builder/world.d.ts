import { ICreateAttachment, ICreateLog } from '../runtime/attachment_manager';
export interface IWorldOptions {
    attach: ICreateAttachment;
    log: ICreateLog;
    parameters: any;
}
export interface IWorld {
    readonly attach: ICreateAttachment;
    readonly log: ICreateLog;
    readonly parameters: any;
    [key: string]: any;
}
export default class World implements IWorld {
    readonly attach: ICreateAttachment;
    readonly log: ICreateLog;
    readonly parameters: any;
    constructor({ attach, log, parameters }: IWorldOptions);
}
