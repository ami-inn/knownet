import { Schema, Document,Model, model } from "mongoose";


interface faqItem extends Document{
    question: string;
    answer: string;

}

interface category extends Document {
    title: string;
}

interface bannerImage extends Document{
    public_id: string;
    url:string
}

interface Layout extends Document {
    type: string;
    faq:faqItem[];
    categories:category[];
    banner:{
        image:bannerImage;
        title:string;
        subtitle:string;
    }
}

const faqSchema = new Schema<faqItem>({
    question:{type:String},
    answer:{type:String}
})

const categorySchema = new Schema<category>({
    title:String
})

const bannerImageSchema = new Schema<bannerImage>({
    public_id:{type:String},
    url:{type:String}
})

const layoutSchema = new Schema<Layout>({
    type:{type:String},
    faq:[faqSchema],
    categories:[categorySchema],
    banner:{
        image:bannerImageSchema,
        title:{type:String},
        subtitle:{type:String}
    }
})

const layoutModel = model<Layout>('Layout',layoutSchema)

export default layoutModel