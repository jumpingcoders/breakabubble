let reaction = ""

function superHey() {

    const list = document.body.querySelectorAll('div')
    for (var i = list.length-1; i >= 0; i--) {
        const buttonElement: any = list[i];
        if (/^.*Super.*$/g.test(buttonElement.innerText)) {
            buttonElement.removeEventListener('click', clickListener, false)
            buttonElement.addEventListener('click', clickListener, false)
        }
    }
}

function clickListener(event: MouseEvent) {
    let urlik = findUserId(event.target as HTMLElement)
    alert(urlik)
}

setInterval(() => {
   superHey()
}, 500);


function _findUserIdOnSelfOfChildren(element: HTMLElement):string[] {//todo not optimalisation
    const userIds:string[] = []
    if(element.tagName==='A'){
        const url = element.getAttribute('href');
        if(typeof url === 'string'){
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                console.log(url)
                if (!/https?:\/\/(.*)?facebook\.com\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
                  userIds.push(url);  
                }
            }
        }
    }
    for(let i=0,l=element.children.length;i<l;i++){
        const child = element.children[i];
        for(const userId of _findUserIdOnSelfOfChildren(child as HTMLElement)){
            userIds.push(userId);
        }
    }
    console.log(userIds)
    return userIds
}


function findUserId(element: HTMLElement):string {

    const userIds = _findUserIdOnSelfOfChildren(element);

    if(userIds.length===0){
        if(element.parentElement) {
            return findUserId(element.parentElement);
        }else{
            console.log(element);
            throw new Error('Cant get any user id.');
        }
    }else
    if(userIds.length===1){
        return userIds[0];
    }else{
        console.warn('Cant get unique user id.', element);
        return userIds[0]
        //throw new Error('Cant get unique user id.');
    }

}
