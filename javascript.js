function createDeck () {
    const color = [1, 2, 3]
    const number = [1, 2, 3]
    const shape = [1, 2, 3]
    const shade = [1, 2, 3]
    let deck = []
    for (let c of color) {
        for (let n of number) {
            for (let s of shape) {
                for (let sh of shade) {
                    deck.push([c,n,s,sh])
                }
            }
        }
    }
    return deck;
}

let deck = createDeck()

let group = []

function newCard () {
    let cardNum = Math.floor(Math.random() * deck.length);
    let thisCard = deck[cardNum]
    group.push(thisCard)
    deck.splice(cardNum, 1)
    return thisCard
}

function makeGroup() {
    for(var i=0; i < 12; i++){
        newCard();
    }
    return group;
}

function updateGroup(chosenCards) {
    let updatedGroup = []
    let translatedCards = []
    for (let card of chosenCards) {
        let dog = card.split('')
        translatedCards.push(dog)
    }
    for (let card of translatedCards) {
        updatedCard = []
        for (let str of card) {
            let numby = Number(str)
            updatedCard.push(numby)
        }
        updatedGroup.push(updatedCard)
    }
    let counter = 0
    for (let card of updatedGroup) {
        if (group.indexOf(card) !== 1) {
            group.splice(group.indexOf(card), 1);
            counter += 1;
        }
    }
}



function playField() {
    group = []
    let pageCards = document.getElementById('group');
    while (pageCards.firstChild) {
        pageCards.removeChild(pageCards.firstChild)
    }
    let currentGroup = makeGroup();
    for (let card of currentGroup) {
        cleanCard = card.join('');
        draw(cleanCard);
    }
}

function draw (cardNum) {
    let group = document.getElementById('group');
    let card  = document.createElement('img');
    card.setAttribute('src', `set_img/${cardNum}.png`);
    card.setAttribute('id', `${cardNum}`)
    card.setAttribute('height', '200');
    card.setAttribute('width', '142');
    card.setAttribute('class', 'set-card')
    group.appendChild(card);
    $( `#${cardNum}` ).click(function() {
        if (card.classList.contains('selected-card')) {
            $(`#${cardNum}`).removeClass('selected-card')
            if (selectedCards.includes(card.id)) {
                let cardPos = selectedCards.indexOf(card.id)
                selectedCards.splice(cardPos, 1)
            }
        } else {
            $(`#${cardNum}`).addClass('selected-card')
            selectCard(cardNum)
        }
      });
}

var selectedCards = []

function checkMatch (card1, card2, card3) {
    counter = 0
    for (let i of card1) {
        if (i === card2[counter] && i === card3[counter]) {
            counter += 1;
            continue;
        } else if ((+i + +card2[counter] + +card3[counter]) == 6) {
            counter += 1;
            continue;
        } else {
            return false;
        }
    }
    return true;
}

$( "#resetbutton" ).click(function() {
    playField()
    $( ".solve-it" ).remove();
  });

function selectCard (card) {
    if (!(selectedCards.includes(card))) {
        selectedCards.push(card)
    }
    if (selectedCards.length == 3) {
        updateGroup(selectedCards)
        let match = checkMatch(selectedCards[0], selectedCards[1], selectedCards[2])
        if (match === false) {
            const setCards =  document.querySelector('.selected-card')
            $('.selected-card').addClass('animated shake')
            setCards.addEventListener('animationend', function() {
                $('.selected-card').removeClass('animated shake')
                $('.selected-card').removeClass('selected-card')
            })
        } else {
            cardAnimation1();
        }
        selectedCards = []
    }
}

function cardAnimation1 () {
    $('#solution-button').text('Show Solutions')
    $( ".solve-it" ).remove();
    $('.selected-card').addClass('animated fadeOutDownBig')
    let setCards =  document.querySelector('.selected-card')
    setCards.addEventListener('animationend', function(animation) {
        if (animation.animationName === 'fadeOutDownBig') {
            $('.selected-card').removeClass('animated fadeOutDownBig')
            $('.selected-card').addClass('halfanimate')
            cardAnimation2();
        }
    })
}

function cardAnimation2 () {
    replaceCards();
    let setCards = document.querySelector('.halfanimate')
    $('.selected-card').addClass('animated fadeInDownBig')
    setCards.addEventListener('animationend', function(animation) {
        if (animation.animationName === 'fadeInDownBig') {
            $('.selected-card').removeClass('animated fadeInDownBig')
            $('.selected-card').removeClass('halfanimate')
            $('.selected-card').removeClass('selected-card')
        }
        
    })
}


function replaceCards () {
    document.querySelectorAll('.selected-card').forEach(function(card) {
        $(`#${card.id}`).off();
        let newCards = newCard().join('')
        card.setAttribute('src', `set_img/${newCards}.png`);
        card.setAttribute('id', `${newCards}`)
        $( `#${newCards}` ).click(function() {
            $(`#${newCards}`).addClass('selected-card')
            selectCard(newCards)
          });

    })
}

playField()


//Solution-finding code

let finalForm = []

$( "#solution-button" ).click(function() {
    if ($('#solution-button').text() === 'Show Solutions') {
        $('#solution-button').text('Hide Solutions')
        $( ".solve-it" ).remove();
        finalForm = [];
        lookThruSets()
        displaySolutions(finalForm)
    } else {
        $('#solution-button').text('Show Solutions')
        $( ".solve-it" ).remove();
    }
    

  });

function lookThruSets () {
    let passedSets = [];
    let thisGroup = currentBoard()
    for (let card of thisGroup) {
        for (let card2 of thisGroup){
            if (compArrs(card, card2)) {
                continue;
            }
            for (let card3 of thisGroup) {
                if ((compArrs(card3, card)) || (compArrs(card2, card3)))  {
                    continue;
                }
                if (checkMatch(card, card2, card3)) {
                    passedSets.push([card, card2, card3])
                }
            }
        }
    }
    return delDuplicate(passedSets)
}

function compArrs (arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false
        }
    }   
    return true;
}

function sortNumber(a,b) {
    return a - b;
}

function delDuplicate (array) {
    let correctList = [];
    let intArray = []
    for (let set of array) {
        intCard = []
        for (let card of set) {
            let strCard = Number(card.join(''))
            intCard.push(strCard)
        }
        intArray.push(intCard)
    }
    for (let set of intArray) {
        set.sort(sortNumber)
    }
    let strArray = []
    for (let set of intArray) {
        strCard = []
        for (let card of set) {
            let strCardi = card.toString()
            strCard.push(strCardi)
        }
        let newStrArray = strCard.join('-')
        strArray.push(newStrArray)
    }
    for (let set of strArray) {
        if (!(correctList.includes(set))) {
            correctList.push(set)
        }
    }

    for (let set of correctList) {
        let backToArr = set.split('-')
        finalForm.push(backToArr)
    }
    return finalForm
}

function displaySolutions (solutions) {
    let counter = 0
    if (solutions.length === 0) {
        let noSolution = `<p class='solve-it'>There are no sets!!!></p>`
        $('#solutions').append(noSolution);
        return
    }
    for (let solution of solutions) {
        let button = `<button class='solve-it btn-outline-secondary' data-index='${counter}' id='solution${counter}'>Solution ${counter + 1}</button>`
        $('#solution-list').append(button);
        counter += 1;
    }
    counter = 0;
    clickEvent()
}

function clickEvent () {
    $('.solve-it').each(function(i, button) {
        let thisSolution = button.dataset.index
        $( `#solution${thisSolution}` ).click(function() {
            showSolution(thisSolution)
            makeAnimation('.solution-card', 'bounceIn')
          });
    });
}

function showSolution (button) {
    for (let card of finalForm[button]) {
        $(`#${card}`).addClass('solution-card')
    }
}

function makeAnimation (animateThis, animation) {
    $(animateThis).each(function(i, button) {
        console.log(animateThis)
        const whatToMove = document.querySelector(animateThis)
        $(animateThis).addClass(`animated ${animation}`)
        whatToMove.addEventListener('animationend', function(e) {
            $(animateThis).removeClass(`animated ${animation}`)
            $(animateThis).removeClass('solution-card')
            $(animateThis).removeClass('hint-card')
        })
    });
}


function currentBoard() {
    let theseCards = []
    document.querySelectorAll('.set-card').forEach(function(card) {
        let thisCard = []
        for (let letter of card.id) {
            let thisLet = Number(letter)
            thisCard.push(thisLet)
        }
        theseCards.push(thisCard)
    })
    return theseCards
}

function giveMeHints () {
    
}

$( "#hint-button" ).click(function() {
    finalForm = [];
    let allSets = lookThruSets()
    let randSet = allSets[Math.floor(Math.random() * allSets.length)];
    let randCard = randSet[Math.floor(Math.random() * randSet.length)];
    $(`#${randCard}`).addClass('hint-card')
    makeAnimation('.hint-card', 'tada')
  });
