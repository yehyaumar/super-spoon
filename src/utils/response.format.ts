export interface IFormatResponse{
  success: boolean;
  message: string;
  data: any;
  error: any;
  errCode: number;
}

export class FormatResponse implements IFormatResponse {
  constructor(success: boolean, message: string, errCode?: number, data?: any){
    this.success = success;
    this.message = message;
    this.data = data;
    this.errCode = errCode;
  }
  
  success: boolean;

  message: string;

  error: any;

  errCode: number;

  data: any
}