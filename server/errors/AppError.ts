export class AppError {
<<<<<<< HEAD
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
=======
    public readonly constraints: Constraints;
    public readonly mess : string
    public readonly property: string;
    public readonly statusCode: number;

    constructor(message : string, property: string ,statusCode = 400) {
      this.constraints = new Constraints(message);
      this.property = property;
      this.statusCode = statusCode;
    }
    
  }
  class Constraints{
    public readonly message : string
    constructor(mess : string){
      this.message = mess;
    }
    }
  
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
