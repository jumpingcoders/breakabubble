let reaction = ""


//const elementsCache: {element: HTMLElement; reaction: number}[] = [];




function superHey() {

    const list = document.body.querySelectorAll('div[data-reaction]');
    for (var i = list.length-1; i >= 0; i--) {
        const buttonElement: any = list[i];

        /*elementsCache.push({
            element: buttonElement,
            reaction: buttonElement.getAttribute('data-reaction')

        });*/


        buttonElement.style.border = '1px solid red';
        //buttonElement.setAttribute('data-my',buttonElement.getAttribute('data-reaction'));


        const clickListener = createClickListener(parseInt(buttonElement.getAttribute('data-reaction')));


        buttonElement.removeEventListener('click', clickListener, false)
        buttonElement.addEventListener('click', clickListener, false)

    }
}




const clickListenersCache: {
    [key: number]: (event: MouseEvent) => never
} = {};
function createClickListener(reaction:number){
    return clickListenersCache[reaction] = clickListenersCache[reaction]||clickListener.bind(null, reaction);
}


function clickListener(reaction:number , event: MouseEvent) {

    const element = event.target as HTMLElement;

    //const reaction = elementsCache.find((item)=>item.element===element);

    console.log(reaction);

    let url = findUserId(element);
    alert(`Reaction ${reaction} on page "${url}".`);
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
                //console.log(url)
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
    //console.log(userIds)
    return userIds
}


function findUserId(element: HTMLElement):string {

    const userIds = _findUserIdOnSelfOfChildren(element);

    if(userIds.length===0){
        if(element.parentElement) {
            return findUserId(element.parentElement);
        }else{
            //console.log(element);
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
