import Qs from 'qs';
import axios from 'axios';
import myUtil from './util';
import store from '../store'

// 创建axios实例
const service = axios.create({
    timeout: 12000 // 请求超时时间
});
// 创建axios实例(带遮罩loading拦截器)
const serviceLoad = axios.create({
    timeout: 12000 // 请求超时时间
});
/*
* 添加请求拦截器
*/
service.interceptors.request.use(config=> {
    return config;
}, err=> {
    myUtil.Toast({message:'网络请求超时~'});
    return Promise.resolve(err);
});
/*
* 添加请求拦截器
*/
serviceLoad.interceptors.request.use(config=> {
    store.commit('showShadeLoading');
    return config;
}, err=> {
    myUtil.Toast({message:'网络请求超时~'});
    return Promise.resolve(err);
});
/*
* 添加响应拦截器
*/
service.interceptors.response.use(data=> {
    if (data.status && data.status == 200 && data.data.status == 'error') {
        myUtil.Toast.error({message: data.data.msg});
        return;
    }
    return data;
}, err=> {
    if (err.response.status == 504 || err.response.status == 404) {
        myUtil.Toast({message:'服务器请求失败，请稍后再试~'});
    } else if (err.response.status == 403) {
        myUtil.Toast({message:'权限不足，请联系管理员~'});
    } else {
        myUtil.Toast({message:'未知错误~'});
    }
    return Promise.resolve(err);
});
/*
* 添加响应拦截器
*/
serviceLoad.interceptors.response.use(data=> {
    if (data.status && data.status == 200 && data.data.status == 'error') {
        myUtil.Toast.error({message: data.data.msg});
        return;
    }
    store.commit('hideShadeLoading');
    return data;
}, err=> {
    if (err.response.status == 504 || err.response.status == 404) {
        myUtil.Toast({message:'服务器请求失败，请稍后再试~'});
    } else if (err.response.status == 403) {
        myUtil.Toast({message:'权限不足，请联系管理员~'});
    } else {
        myUtil.Toast({message:'未知错误~'});
    }
    return Promise.resolve(err);
});

export default {
 //   post  表单请求
 formPost(url,params,type){
     let httpService = service;
     if(type){
         store.commit('setLoadingType',type);
         httpService = serviceLoad;
     }
     const promiser = new Promise((resolve,reject)=>{
         httpService({
             method: 'post',
             url: url,
             data: Qs.stringify(params),
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
                 // 'Content-Type': 'application/json;charset=UTF-8'
             }
         }).then(res=>{
             resolve(res.data);
         }).catch(err=>{
             reject(err);
         })
     });
     return promiser;
 },
 //post   json 请求
    jsonPost(url,params,type){
        let httpService = service;
        if(type){
            store.commit('setLoadingType',type);
            httpService = serviceLoad;
        }
        const promiser = new Promise((resolve,reject)=>{
            httpService({
                method: 'post',
                url: url,
                data: params,
                dataType: 'json',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            })
        });
        return promiser;
    },
    //自定义文件提交
    filePost(url,file,type){
        let httpService = service;
        if(type){
            store.commit('setLoadingType',type);
            httpService = serviceLoad;
        }
        let formData = new FormData();
        formData.append('file', file);
        const promiser = new Promise((resolve, reject) => {
            httpService({
                method: 'post',
                url: url,
                data: formData,
                dataType: 'json',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
        return promiser;
    },
    jsonPostHeaderUser(url,params,type){
        let httpService = service;
        if(type){
            store.commit('setLoadingType',type);
            httpService = serviceLoad;
        }
        const promiser = new Promise((resolve,reject)=>{
            httpService({
                method: 'post',
                url: url,
                data: params,
                dataType: 'json',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'application/json;charset=UTF-8',
                    'userName': localStorage.getItem('userName') || ''
                }
            }).then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            })
        });
        return promiser;
    },
    //自定义请求头 post 请求
    headerPost(url, params) {
        let appInfo = myUtil.isApp() || {};
        let zid = myUtil.GetQueryString("infoId"),
            id = appInfo.id,
            appCode = appInfo.appCode,
            appversion = appInfo.appVersion;
        const promiser = new Promise((resolve, reject) => {
            service({
                method: 'post',
                url: url,
                data: params,
                dataType: 'json',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': zid,
                    'appVersion': appversion,
                    'id': id,
                    'clientType': 'H5',
                    'appCode': appCode
                }
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
        return promiser;
    },
    //get请求
    get(url, params) {
        const promiser = new Promise((resolve, reject) => {
            service({
                method: 'get',
                url: url,
                params: params
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
        return promiser;
    }
}
