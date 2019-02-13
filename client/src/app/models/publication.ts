export class Publication{
    constructor(
        public _id:string,
        public text:string,
        public file:string,
        public create_at:string,
        public user:string
    ){}
}