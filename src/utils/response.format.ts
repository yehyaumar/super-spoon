export interface IFormatResponse{
  success: boolean;
  message: string;
  data: any;
  error: any;
}

export class FormatResponse implements IFormatResponse {
  constructor(success: boolean, message: string, data?: any){
    this.success = success;
    this.message = message;
    this.data = data;

  }
  
  success: boolean;

  message: string;

  error: any;
  
  data: any
}