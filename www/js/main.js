var myMain = {
	cardID: "cards",
	dispID: "out",
	saveID: "saved_pane",
	nameHist: [],
	nameI:    0, //Current name index
	nameMax: 50, //Number of previous names to store
	saveKay: "saved_names", //key for local storage (pipe delimited)
	facebook: 0, //flag for facebook, as well as index to URL
	twitter:  1, //flag for twitter, as well as index to URL
	socialUrls: [
		'https://facebook.com/',
		'https://twitter.com/',
	], //TODO: make them postable URLs

	/**
	 * Displays the indicated card (zero based)
	 * @param n: the index of the card to make visible
	 */
	card: function(n) {
		var cards = document.getElementById(this.cardID).childNodes;
		var count = 0;
		for (var i=0; i < cards.length; ++i) {
			if (cards[i].tagName == "DIV") {
				if (n == count++)
					cards[i].className = "";
				else
					cards[i].className = "invisible";
			}
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

	/**
	 * Posts current name to social media
	 * @param type: flag to indicate Facebook or Twitter
	 */
	postTo: function(type) {
		var url = myMain.socialUrls[type];
		//TODO: format message based on type
		//TODO: pre-brand message with our hashtag or app name
console.log("Post '"+myMain.nameHist[myMain.nameI]+"' to: " + url);
	},
}
