export function getRedirectPath(data){
    // type  跳入 甲方 乙方
    // 有无头像 等信息 跳转
    if(!data) return '/login';
    if(!data.type) return '/login';
    if(!data.headImg) return data.type == 1 ? '/bossInfo' : '/memInfo';
    if(data.headImg) return '/home';
    return '/home';   
}