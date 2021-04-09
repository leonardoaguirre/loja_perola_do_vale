export class AppError {
  public readonly constraints: Constraints;
  public readonly mess: string
  public readonly property: string;
  public readonly statusCode: number;

  constructor(message: string, property: string, statusCode = 400) {
    this.constraints = new Constraints(message);
    this.property = property;
    this.statusCode = statusCode;
  }

}
class Constraints {
  public readonly message: string
  constructor(mess: string) {
    this.message = mess;
  }
}
