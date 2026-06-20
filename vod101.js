// ignore

//@name:MissAV
//@webSite:https://missav.ai
//@version:1
//@remark:Yvan MissAV
//@codeID:
//@env:
//@isAV:1
//@deprecated:0


import {
    FilterLabel,
    FilterTitle,
    VideoClass,
    VideoSubclass,
    VideoDetail,
    RepVideoClassList,
    RepVideoSubclassList,
    RepVideoList,
    RepVideoDetail,
    RepVideoPlayUrl,
    UZArgs,
    UZSubclassVideoListArgs,
} from '../core/uzVideo.js'


import {
    req,
} from '../core/uzUtils.js'


import {
    cheerio
} from '../core/uz3lib.js'



// 防止重复变量
var appConfig = {

    _webSite:'https://missav.ai',

    get webSite(){
        return this._webSite
    },

    set webSite(value){
        this._webSite=value
    },


    _uzTag:'',

    get uzTag(){
        return this._uzTag
    },

    set uzTag(value){
        this._uzTag=value
    }

}



// 分类

async function getClassList(args){

    let backData=new RepVideoClassList()

    try{

        let html=await req(appConfig.webSite)

        let $=cheerio.load(html)

        $("a").each((i,e)=>{

            let name=$(e).text().trim()
            let href=$(e).attr("href")

            if(
                name &&
                href &&
                href.includes("/categories/")
            ){

                backData.data.push({

                    type_id:href,

                    type_name:name

                })

            }

        })


    }catch(e){

        backData.error=e.toString()

    }


    return JSON.stringify(backData)

}



// 二级分类

async function getSubclassList(args){

    let backData=new RepVideoSubclassList()

    try{


    }catch(e){

        backData.error=e.toString()

    }

    return JSON.stringify(backData)

}



// 视频列表

async function getVideoList(args){


    let backData=new RepVideoList()


    try{


        let url=args.url || appConfig.webSite


        let html=await req(url)


        let $=cheerio.load(html)



        $("a").each((i,e)=>{


            let href=$(e).attr("href")

            let title=$(e)
            .find("img")
            .attr("alt")


            let cover=$(e)
            .find("img")
            .attr("data-src")


            if(
                href &&
                href.includes("/d/")
            ){


                backData.data.push({


                    vod_id:
                    appConfig.webSite+href,


                    vod_name:
                    title || "MissAV",


                    vod_pic:
                    cover || "",


                })

            }


        })



    }catch(e){

        backData.error=e.toString()

    }


    return JSON.stringify(backData)

}



// 二级列表

async function getSubclassVideoList(args){


    return getVideoList(args)

}



// 视频详情

async function getVideoDetail(args){


    let backData=new RepVideoDetail()


    try{


        let html=await req(args.url)


        let $=cheerio.load(html)



        backData.data={


            vod_name:
            $("h1").text().trim(),


            vod_pic:
            $("meta[property='og:image']")
            .attr("content"),


            vod_content:
            $("meta[property='og:description']")
            .attr("content"),


            vod_play_from:
            "MissAV",


            vod_play_url:
            args.url


        }



    }catch(e){

        backData.error=e.toString()

    }


    return JSON.stringify(backData)

}





// 播放地址

async function getVideoPlayUrl(args){


    let backData=new RepVideoPlayUrl()


    try{


        let html=await req(args.url)


        let m3u8 =
        html.match(
        /https?:\/\/[^"']+\.m3u8[^"']*/)


        if(m3u8){


            backData.data={
                url:m3u8[0]
            }


        }else{


            backData.error=
            "未找到m3u8"


        }



    }catch(e){

        backData.error=e.toString()

    }



    return JSON.stringify(backData)

}





// 搜索

async function searchVideo(args){


    let backData=new RepVideoList()


    try{


        let key=
        encodeURIComponent(args.searchWord)


        let url=
        appConfig.webSite+
        "/search/"+key



        return getVideoList({
            url:url
        })



    }catch(e){

        backData.error=e.toString()

    }



    return JSON.stringify(backData)

}