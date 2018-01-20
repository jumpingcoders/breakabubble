
function _onlyUnique<T>(value: T, index: number, self: T[]): boolean {
    return self.indexOf(value) === index;
}


function _findUrlOnPostOnSelfOfChildren(element: HTMLElement):string[] {//todo not optimalisation
    const userIds:string[] = []
    if(element.tagName==='A'){
        const url = element.getAttribute('href');
        if(typeof url === 'string'){
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                //console.log(url)
                if (!/https?:\/\/(.*)?facebook\.com\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                    userIds.push(url);
                }
            }
        }
    }
    for(let i=0,l=element.children.length;i<l;i++){
        const child = element.children[i];
        for(const userId of _findUrlOnPostOnSelfOfChildren(child as HTMLElement)){
            userIds.push(userId);
        }
    }
    return  userIds.filter( _onlyUnique );
}


export default function findUrlOnPost(element: HTMLElement):string|undefined {

    const userIds = _findUrlOnPostOnSelfOfChildren(element);

    if(userIds.length===0){
        if(element.parentElement) {
            return findUrlOnPost(element.parentElement);
        }else{
            //console.log(element);
            //throw new Error('Cant get any user id.');

            return undefined;
        }
    }else
    if(userIds.length===1){
        return userIds[0];
    }else{
        //return undefined;
        console.warn('Cant get unique user id.', userIds);
        return userIds[0]
        //throw new Error('Cant get unique user id.');
    }

}
