var myMain = {
	cardID: "cards",
	dispID: "out",
	saveID: "saved_pane",
	nameHist: [],
	nameI:    0, //Current name index
	nameMax: 50, //Number of previous names to store
	saveKay: "saved_names", //key for local storage (pipe delimited)

	/**
	 * Displays the indicated card (zero based)
	 * @param n: the index of the card to make visible
	 */
	card: function(n) {
		var cards = document.getElementById(this.cardID).childNodes;
		for (var i=0; i < cards.length; ++i) {
console.log("Child " + (i + 1) + " of " + cards.length);
console.log(cards[i]);
			if (n == i)
				cards[i].className = "";
			else
				cards[i].className = "invisible";
		}
	},

	/**
	 * Displays the current name
	 */
	displayName: function() {
		var out = document.getElementById(this.dispID);
		out.innerHTML = this.nameHist[this.nameI];
	},

	/**
	 * Displays the saved names
	 */
	displaySaved: function() {
		var out = document.getElementById(this.saveID);
		var a = this.getSaved();
		//TODO: loop through creating DOM elements for display
out.innerHTML = JSON.stringify(a);
		this.card(1);
	},

	/**
	 * Generate & Display a new name (save to history)
	 */
	nextName: function() {
		if (this.nameI < this.nameHist.length - 1) {
			this.nameI++; //They've navigatyed back. Navigate forward.
		} else { //Generate a new one
			var n = dictionary.get();
			this.nameHist.push(n);
			if (this.nameHist.length > this.nameMax)
				this.nameHist.shift(); //drop first element
			this.nameI = this.nameHist.length - 1;
		}
		this.displayName();
	},

	/**
	 * Fetch a previous name from history
	 */
	prevName: function() {
		if (this.nameI > 0)
			this.nameI--;
		this.displayName();
	},

	/**
	 * Gets the array of saved names
	 */
	getSaved: function() {
		var curr = localStorage.getItem(this.saveKey);
		var a = [];
		if (null != curr && curr.length > 0)
			a = JSON.parse(curr);
		return a;
	},

	/**
	 * Saves a name to localStorage
	 */
	saveName: function() {
		var n = this.nameHist[this.nameI];
		var a = this.getSaved();
		a.push(n);
		this.replaceSavedNames(a);
	},

	/**
	 * Overwrites saved names in localStorage (enabled edit/delete of names)
	 * @param a: array of names to save
	 */
	replaceSavedNames: function(a) {
		localStorage.setItem(this.saveKey, JSON.stringify(a));
	},
}
