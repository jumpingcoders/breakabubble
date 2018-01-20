import findUrlOnPost from './findUrlOnPost';
import * as superagent from 'superagent';



const profileLink = document.body.querySelectorAll('a[title="Profile"]')[0];
const userId = ((profileLink.getAttribute('href')||'').split('/').pop());


//const elementsCache: {element: HTMLElement; reaction: number}[] = [];

const REACTIONS:{
    [key: number]: string
} = {
    0: 'IGNORE',
    1: 'LIKE',
    2: 'LOVE',
    4: 'HAHA',
    3: 'WOW',
    7: 'SAD',
    8: 'ANGRY',


};


const SCROLL_CUTOFF = 50;
let scrollWatch: HTMLElement[] = [];
function scrollWatchTick(){
    const newSrollWatch = [];
    for(const element of scrollWatch){
        if(element.getBoundingClientRect().top<SCROLL_CUTOFF){
            if(element.getAttribute('aria-pressed')==='false'){

                const clickListener = createClickListener(0);
                lastHoveredUrl = findUrlOnPost(element);
                clickListener({target: element});

            }
        }else{

            newSrollWatch.push(element);
        }
    }
    scrollWatch = newSrollWatch;
}
setInterval(()=>scrollWatchTick(),100);




function superHey() {
    {
        const list = document.body.querySelectorAll('div[data-reaction]');
        for (var i = list.length - 1; i >= 0; i--) {
            const buttonElement: any = list[i];

            /*elementsCache.push({
                element: buttonElement,
                reaction: buttonElement.getAttribute('data-reaction')

            });*/


            //buttonElement.style.border = '1px solid red';
            //buttonElement.setAttribute('data-my',buttonElement.getAttribute('data-reaction'));


            const clickListener = createClickListener(parseInt(buttonElement.getAttribute('data-reaction')));


            buttonElement.removeEventListener('click', clickListener, false);
            buttonElement.addEventListener('click', clickListener, false);

        }
    }
    {
        scrollWatch = [];
        const list = document.body.querySelectorAll('a.UFILikeLink');
        for (var i = list.length - 1; i >= 0; i--) {
            const buttonElement: any = list[i];

            buttonElement.removeEventListener('mouseenter', hoverListener, false)
            buttonElement.addEventListener('mouseenter', hoverListener, false)


            //todo aria-pressed
            const clickListener = createClickListener(1);
            buttonElement.removeEventListener('click', clickListener, false);
            buttonElement.addEventListener('click', clickListener, false);

            if(buttonElement.getBoundingClientRect().top>=SCROLL_CUTOFF) {
                scrollWatch.push(buttonElement);
            }

        }
    }
}

let lastHoveredUrl:string|undefined;
function hoverListener(event: MouseEvent){
    const element = event.target as HTMLElement;
    lastHoveredUrl = findUrlOnPost(element);
}



const clickListenersCache: {
    [key: number]: (event: {target: HTMLElement}) => never
} = {};
function createClickListener(reaction:number){
    return clickListenersCache[reaction] = clickListenersCache[reaction]||clickListener.bind(null, reaction);
}


async function clickListener(reactionId:number , event: {target: HTMLElement}) {

    if(typeof lastHoveredUrl !== 'undefined'){

        const reaction = REACTIONS[reactionId];
        const url = lastHoveredUrl;

        console.log(`Reaction ${reaction} on page "${url}".`);

        superagent
            .post(`http://localhost:8000/api/users/${userId}/reactions`)
            .send({reaction,url})
            .set('accept', 'json')
            .end((err, res) => {
                console.log(`Server is saying: "${res.body.message}".`);
                //console.log(err,res);
            });
    }

}

setInterval(() => {
   superHey()
}, 500);


