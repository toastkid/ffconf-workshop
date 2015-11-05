var Student = (function () {
    function Student(firstname, middleinitial, lastname) {
        this.firstname = firstname;
        this.middleinitial = middleinitial;
        this.lastname = lastname;
        this.fullname = "${firstname} ${middleinitial} ${lastname}";
    }
    return Student;
})();
function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname + "</p>";
}
var user = new Student("Martin", "L", "Beeby");
var user1 = new Student("Martin", "Mavrick", "Kearn");
var user2 = new Student("Mike", "The Hit Man", "Taulty");
function printStudents() {
    var listOfStudents = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        listOfStudents[_i - 0] = arguments[_i];
    }
    for (var _a = 0; _a < listOfStudents.length; _a++) {
        var v = listOfStudents[_a];
        document.body.innerHTML += greeter(v);
    }
    return listOfStudents;
}
printStudents(user, user1, user2);
// Create 3 new variables and populate them from an array.
// Now we have 3 new variables called beeby, kearn , taulty
var _a = printStudents(user, user1, user2), beeby = _a[0], kearn = _a[1], taulty = _a[2];
// We can now send the beeby object to be printed again.
printStudents(beeby);
var deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function () {
        var _this = this;
        console.log(this);
        // Notice: the line below is now a lambda, allowing us to capture 'this' earlier
        return function () {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);
            console.log(_this);
            return { suit: _this.suits[pickedSuit], card: pickedCard % 13 };
        };
    }
};
var cardPicker = deck.createCardPicker();
var pickedCard = cardPicker();
alert("card: " + pickedCard.card + " of " + pickedCard.suit);
