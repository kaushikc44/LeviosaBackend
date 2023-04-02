const supa = require("@supabase/supabase-js")
const config =  require("config")
const apiKey = config.get('API_KEY');
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: apiKey,
});
const PNG = require("pngjs").PNG;
const fs = require("fs");
const supabaseurl = config.get('Supabase_Url_key')
const supabaseAnon =  config.get('Supabase_Anon_key');
const openai = new OpenAIApi(configuration);
let image_url = []
let copiedArr = ["https://oaidalleapiprodscus.blob.core.windows.net/private/org-ly5GphjXTO7U5GawU4ToSrUu/user-el5TfuXeAaNqiu9Z477Xlx3Q/img-xCcOUlfiLeH4XxKGot4wkYmh.png?st=2023-03-16T15%3A12%3A29Z&se=2023-03-16T17%3A12%3A29Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-15T21%3A13%3A46Z&ske=2023-03-16T21%3A13%3A46Z&sks=b&skv=2021-08-06&sig=5fcp55SYnQjyNKLlAs0Xc1GkWBe5CO0ObEhuGWyJ%2BUk%3D"];
const value = []
const dic = new Object();
const imagegeneration = async (userInput) => { 
    console.log("Have entered the field")
    image_url = []
    try {
        const response = await openai.createImage({
            prompt:userInput,
            n:2,
            size:'256x256',
        })
        
        for(let i=0; i < 2;i++){
            image_url.push(response.data.data[i].url);   
            // copiedArr.push(response.data.data[i].url) 
        }
        console.log(image_url)
        
        return  {status:"success",result:image_url};
       
    }
    catch (e){
        console.log("Error has bestrowed upon us")
        return await {status:"Error from openAI", error: e}
    }

}
const mockurl = async () => {
    try{
        const arr = ["https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp","https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp","https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp","https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp","https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(76).webp","https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp"]
        return {status:"success",result:arr}
    }
    catch (e){
        return {status:"error",result:e}
    }



}

const supabaseStorage = async () =>{
    console.log("Reaching inside the supabase Function")
    try{
        supabase_Url = supabaseurl;
        supabase_Anon = supabaseAnon;
        const supabase = await supa.createClient(supabase_Url,supabase_Anon);
        if (copiedArr.length !== 0){
            const supabaseUrl = [];
            for( i = 0 ; i < copiedArr.length;i++){
                const req  = axios.get(copiedArr[i], { responseType: 'arraybuffer' })
                console.log("AXIOS IS DONE!")
                
                if (req.data === undefined){
                    return {"status":500,"error":"Can't fetch the data","Request":req}
                }
                const png = new PNG();
                png.parse(req.data,(err,data) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        data
                    }
                })
                const d = new Date();
                const time = d.getTime();
                const {data,error} = await supabase.storage.from('avatars').upload(`${time}`,formData,{cacheControl:'3600',upsert: false})
                console.log(error)
                if (error === null){
                    console.log("Entered")
                    const{data,error} = await  supabase.storage.from('avatars').createSignedUrl(`${time}`,31563000)
                    if (error === null){
                        supabaseUrl.push(data['signedUrl']);
                    }
                    else{
                        return {"status":500,"result":"error fetching signed"};
                    }
                }
                else{
                    return {"status":500,"result":"error Uploading"}
                }
            }
            if(supabaseUrl.length !== 0 ){
                return {"status":200,"result":supabaseUrl}
                copiedArr = [];
            }
            else{
                return {"status":500,"result":"Not Signed found"}
            }
          }
          else{
            return {"status":500,"result":"No content found"}
            }
    }catch(error){
        return {"status":500,"result":error}
    }
}

module.exports =  {imagegeneration,mockurl,supabaseStorage};