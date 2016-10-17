/***************************************
Phrase Formats:
 +N. Noun(s)           Gorilla
 +N. Noun Noun(s)      Gorilla Cake
 +N. Adjective Noun(s) Ugly Gorilla(s)
  N. Adj Adj Noun(s)   Pretty Ugly Gorilla(s)
  N. Adv Adj Noun(s)   Murderously Ugly Gorilla(s)
 +N. Gerund Noun(s)    Fighting Gorilla(s)
  N. Ger Adj Noun(s)   Fighting Ugly Gorilla(s)
  N. Adj Ger NounS     Ugly Fighting Gorilla(s)
  N. Noun Adjective    Gorilla Ugly
  N. Noun Verb-er(s)   Gorilla Puncher(s)
  N. Noun Verb(s)      Gorilla Fight(s)
  N. Noun Verb-ed      Gorilla Breached
 +N. Verb-ed Noun      Breached Gorilla
  N. Num Noun(s)       3 Gorillas (s determined by num > 1)
  N. Num Adj Nouns     3 Ugly Gorillas (s determined by num > 1)

  G. Ger Adv           Fighting Murderously
  G. Adv Ger           Murderously Fighting
  G. Ger Verb-er(s)    Fighting Puncher(s)

  op. and, or, not, in, of, the, and the, in the, of the, formerly, etc...

 +1 - N                Pretty Ugly Gorillas
  2 - G                Fighting Punchers
  3 - N op N           Pretty Ugly Gorilla and the 3 Ugly Gorillas
  4 - N G              Pretty Ugly Gorillas Fighting Punchers
  5 - N's N            Gorilla Punchers' Breached Gorilla ("'s" vs "s'")

  + means to weigh more heavily so rand picks it more commonly

Dependencies:
  grammar_adj.js  - makes 2D array gramAdj [adjective, optional adverb form]
  grammar_noun.js - makes 2D array gramNoun [noun, pluralizer (usually "s")]
  grammar_num.js  - makes 1D array gramNum with #s we can display before a noun
  grammar_op.js   - makes 1D array gramOp with conjunctions/prepositions
  grammar_verb.js - makes 2D array gramVerb [verb,verbs,verbed,verber,optional non-standard gerund]
***************************************/

var dictionary = {
	/**************************** Constants (Pseudo) ****************************/
	iAdj:     0,
	iAdv:     1,
	iNoun:    0,
	iNouns:   1,
	iVerb:    0,
	iVerbs:   1,
	iVerbed:  2,
	iVerber:  3,
	iVerbing: 4,

	/**************************** Functions ****************************/

	/**
	 * Get an acceptible phrase from the dictionary
	 * @param word: base form of word
	 */
	get: function() {
		var numPhraseTypes = 7; //counting first type 3x for statistical skew
		var br = '<br/>';
		var i = 0;
		var r = this.randRange(0,numPhraseTypes - 1);
//console.log("Phrase Type: "+r);
		if (r < ++i)
			return this.getG();
		if (r < ++i)
			return this.getN() + br + this.getRandItem(gramOp) + br + this.getN();
		if (r < ++i)
			return this.getN() + br + this.getG();
		if (r < ++i)
			return this.possessive(this.getN()) + br + this.getN();
		//Save most common type for last, since there are 2 ranges left
		return this.getN();
	},

	/**
	 * Fetches a Gerund in one of the forms it is allowed to be
	 */
	getG: function() {
		var rtn = '';
		var numPhraseTypes = 3;
		var v1 = this.getRandItem(gramVerb);
		var alternate = (v1.length > this.iVerbing) ? v1[this.iVerbing] : ""; //may not exist
		var g = this.gerund(v1[this.iVerb], alternate);
		var r = this.randRange(0,numPhraseTypes - 1);
		if (r < numPhraseTypes - 1) {
			var a = [];
			while (a.length <= this.iAdv)
				a = this.getRandItem(gramAdj);
			a = a[this.iAdv];
			if (0 == r) //Gerund + Adverb (Fighting Muderously)
				rtn = g + ' ' + a;
			else (1 == r) //Adverb + Gerund (Murderously Fighting)
				rtn = a + ' ' + g;
		} else { //Gerund + Verber(s) (Fighting Punchers)
			var v2 = this.getRandItem(gramVerb);
			v2 = this.plural(v2[this.iVerber], "s", 50);
			rtn = g + ' ' + v2;
		}
		return rtn;
	},

	/**
	 * Fetches a Noun in the many forms it is allowed to be
	 */
	getN: function() {
		var types = 20;
		var r = this.randRange(0, types - 1);
		var i = 0;
		var n1 = this.getRandItem(gramNoun);
		var pNoun = this.plural(n1[this.iNoun], n1[this.iNouns], 50); //50% chance to be pluralized
//console.log("getN("+r+")");

		++i; //2x range for this popular option
		if (r < ++i) { //Noun(s), and nothing else
			return pNoun;
		}

		++i; //2x
		if (r < ++i) { //Noun + Noun(s)
			var n2 = this.getRandItem(gramNoun);
			return n2[this.iNoun] + ' ' + pNoun;
		}

		++i; //2x
		if (r < ++i) { //Adjective + Noun(s)
			var ad1 = this.getRandItem(gramAdj);
			return ad1[this.iAdj] + ' ' + pNoun;
		}

		if (r < ++i) { //Adj + Adj + Noun(s)
			var ad1 = this.getRandItem(gramAdj);
			var ad2 = this.getRandItem(gramAdj);
			return ad1[this.iAdj] + ' ' + ad2[this.iAdj] + ' ' + pNoun;
		}

		if (r < ++i) { //Adv + Adj + Noun(s)
			var ad1 = this.getRandItem(gramAdj);
			var ad2 = this.getRandItem(gramAdj);
			return ad1[this.iAdv] + ' ' + ad2[this.iAdj] + ' ' + pNoun;
		}

		++i; //2x
		if (r < ++i) { //Gerund + Noun(s)
			var v1 = this.getRandItem(gramVerb);
			var alternate = (v1.length > this.iVerbing) ? v1[this.iVerbing] : ""; //may not exist
			var g = this.gerund(v1[this.iVerb], alternate);
			return g + ' ' + pNoun;
		}

		if (r < ++i) { //Ger + Adj + Noun(s)
			var v1 = this.getRandItem(gramVerb);
			var alternate = (v1.length > this.iVerbing) ? v1[this.iVerbing] : ""; //may not exist
			var g = this.gerund(v1[this.iVerb], alternate);
			var ad1 = this.getRandItem(gramAdj);
			return g + ' ' + ad1[this.iAdj] + ' ' + pNoun;
		}

		if (r < ++i) { //Adj + Ger + Noun(s)
			var v1 = this.getRandItem(gramVerb);
			var alternate = (v1.length > this.iVerbing) ? v1[this.iVerbing] : ""; //may not exist
			var g = this.gerund(v1[this.iVerb], alternate);
			var ad1 = this.getRandItem(gramAdj);
			return ad1[this.iAdj] + ' ' + g + ' ' + pNoun;
		}

		if (r < ++i) { //Noun + Adj
			var ad1 = this.getRandItem(gramAdj);
			return n1[this.iNoun] + ' ' + ad1[this.iAdj];
		}

		if (r < ++i) { //Noun + Verber
			var v1 = this.getRandItem(gramVerb);
			return n1[this.iNoun] + ' ' + v1[this.iVerber];
		}

		if (r < ++i) { //Noun + Verb(s)
			var v1 = this.getRandItem(gramVerb);
			v1 = this.plural(v1[this.iVerb], v1[this.iVerbs], 50); //50% chance to be pluralized
			return n1[this.iNoun] + ' ' + v1;
		}

		if (r < ++i) { //Noun + Verbed
			var v1 = this.getRandItem(gramVerb);
			return n1[this.iNoun] + ' ' + v1[this.iVerbed];
		}

		++i; //2x
		if (r < ++i) { //Verbed + Noun
			var v1 = this.getRandItem(gramVerb);
			return v1[this.iVerbed] + ' ' + n1[this.iNoun];
		}

		if (r < ++i) { //Num Noun(s)
			var num = this.getRandItem(gramNum);
			if (num == "1" || num == "One")
				n1 = n1[this.iNoun];
			else
				n1 = this.plural(n1[this.iNoun], n1[this.iNouns]); //100% chance of plural
			return num + ' ' + n1;
		}

		if (r < ++i) { //Num Adj Noun(s)
			var ad1 = this.getRandItem(gramAdj);
			var num = this.getRandItem(gramNum);
			if (num == "1" || num == "One")
				n1 = n1[this.iNoun];
			else
				n1 = this.plural(n1[this.iNoun], n1[this.iNouns]); //100% chance of plural
			return num + ' ' + ad1[this.iAdj] + ' ' + n1;
		}
	},

	/**
	 * Fetches a random item from an array
	 * @param a: the array to fetch from
	 */
	getRandItem: function(a) {
		var r = this.randRange(0, a.length - 1);
		return a[r];
	},

	/**
	 * Transform a word into its gerund form (e.g. "Zapping")
	 * @param word: base form of word
	 * @param alternate: "" for "ing", or a replacement word like "Zapping"
	 */
	gerund: function(word,alternate) {
		if (alternate.length > 3)
			return alternate;
		if (word.endsWith("e")) //drop the "e" add "ing"
			word = word.substr(0, word.length - 1)
		return word + "ing";
	},

	/**
	 * Transform a word into its plural form (e.g. "Mice")
	 * @param word: base form of word
	 * @param suffix: "", "s", "es" to append, or a replacement word like "mice"
	 * @param chance: percent chance of pluralization (usually 50, but assume 100)
	 */
	plural: function(word,suffix,chance) {
		if (null == chance)
			chance = 100; //Assume they definitely want the plural form
		var r = this.randRange();
		if (chance < r) //Don't pluralize
			return word;
		if (suffix.length > 2)
			return suffix; //like "mice"
		return word + suffix; //like "tiger" + "s"
	},

	/**
	 * Transform a word into its possessive form (e.g. "Gorilla's")
	 * @param word: base form of word
	 */
	possessive: function(word) {
		if (word.endsWith("s"))
			return word + "'";
		return word + "'s";
	},

	/**
	 * Returns a random integer in the specified inclusive range
	 * @param min: int range minimum (assumes 0)
	 * @param max: int range maximum (assumes 100)
	 */
	randRange: function(min, max) {
		if (null == min)
			min = 0;
		if (null == max)
			max = 100;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
}
