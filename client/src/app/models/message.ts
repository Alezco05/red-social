export class Message{
    constructor(
        public _id:string,
        public text:string,
        public viewed:string,
        public create_at:string,
        public emitter:string,
        public receiver:string
    ){}
}