interface Person {
  firstname: string;
  lastname: string;
}

class Student {
  fullname: string;
  constructor(public firstname, public middleinitial, public lastname){
    this.fullname = "${firstname} ${middleinitial} ${lastname}" 
  }
}

function greeter(person : Person) {
		return `Hello, ${person.firstname} ${person.lastname}</p>`;
	}
  


var user = new Student("Martin", "L", "Beeby");
var user1 = new Student("Martin", "Mavrick", "Kearn");
var user2 = new Student("Mike", "The Hit Man", "Taulty");

function printStudents(...listOfStudents: Student[]) {
    for (var v of listOfStudents) {
            document.body.innerHTML += greeter(v);
    }
    return listOfStudents;
}

printStudents(user,user1, user2)

// Create 3 new variables and populate them from an array.
// Now we have 3 new variables called beeby, kearn , taulty
var [beeby, kearn, taulty] = printStudents(user,user1, user2)

// We can now send the beeby object to be printed again.
printStudents(beeby)

var deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        console.log(this);
        // Notice: the line below is now a lambda, allowing us to capture 'this' earlier
        return () => {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);
            console.log(this);
            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

var cardPicker = deck.createCardPicker();
var pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);


