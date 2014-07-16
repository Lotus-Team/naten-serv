/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *
 *   allowchallenges: function (target, room, user) {
 *     user.blockChallenges = false;
 *     this.sendReply("You are available for challenges from now on.");
 *   }
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will add the message to
 *   the room, and turn on the flag this.broadcasting, so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canBroadcast(suppressMessage)
 *   Functionally the same as this.canBroadcast(). However, it
 *   will look as if the user had written the text suppressMessage.
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message, room)
 *   Checks to see if the user can say the message in the room.
 *   If a room is not specified, it will default to the current one.
 *   If it has a falsy value, the check won't be attached to any room.
 *   In addition to running the checks from this.canTalk(), it also
 *   checks to see if the message has any banned words, is too long,
 *   or was just sent by the user. Returns the filtered message, or a
 *   falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target, exactName)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 * this.getLastIdOf(user)
 *   Returns the last userid of an specified user.
 *
 * this.splitTarget(target, exactName)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whois: function (target, room, user) {
		var targetUser = this.targetUserOrSelf(target, user.group === ' ');
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}

		this.sendReply("User: " + targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts();
			var output = Object.keys(targetUser.prevNames).join(", ");
			if (output) this.sendReply("Previous names: " + output);

			for (var j = 0; j < alts.length; ++j) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply("Alt: " + targetAlt.name);
				output = Object.keys(targetAlt.prevNames).join(", ");
				if (output) this.sendReply("Previous names: " + output);
			}
		}
		if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
			this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
		}
		if (targetUser.isSysop) {
			this.sendReply("(Pok\xE9mon Showdown System Operator)");
		}
		if (targetUser.name === 'naten2006') {
			this.sendReply("(Lotus Community Founder)");
		}
		if (targetUser.name === 'BrittleWind') {
			this.sendReply("(Lotus CSS Manager)");
		}
		if (targetUser.name === 'Receptionist147') {
			this.sendReply("(Lotus Server Sponsor)");
		}
		if (targetUser.name === 'Twamble') {
			this.sendReply("(Lotus Graphic Designer)");
		}
		if (!targetUser.authenticated) {
			this.sendReply("(Unregistered)");
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", "));
		}
		var output = "In rooms: ";
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += " | ";
			first = false;

			output += '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
		}
		this.sendReply('|raw|' + output);
	},

	ipsearch: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP " + target + ":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected ? " + " : "-") + " " + user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function (target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply("Room " + roomid + " not found.");
		}
		return this.parse('/msg ' + this.targetUsername + ', /invite ' + roomid);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	details: 'data',
	dt: 'data',
	data: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;

		var buffer = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		var showDetails = (cmd === 'dt' || cmd === 'details');
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; ++i) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					buffer = "No Pokemon, item, move, ability or nature named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				if (newTargets[i].searchType === 'nature') {
					buffer += "" + newTargets[i].name + " nature: ";
					if (newTargets[i].plus) {
						var statNames = {'atk': "Attack", 'def': "Defense", 'spa': "Special Attack", 'spd': "Special Defense", 'spe': "Speed"};
						buffer += "+10% " + statNames[newTargets[i].plus] + ", -10% " + statNames[newTargets[i].minus] + ".";
					} else {
						buffer += "No effect.";
					}
					return this.sendReply(buffer);
				} else {
					buffer += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				}
			}
		} else {
			return this.sendReply("No Pokemon, item, move, ability or nature named '" + target + "' was found. (Check your spelling?)");
		}

		if (showDetails) {
			if (newTargets[0].searchType === 'pokemon') {
				var pokemon = Tools.getTemplate(newTargets[0].name);
				if (pokemon.weightkg >= 200) {
					var weighthit = 120;
				} else if (pokemon.weightkg >= 100) {
					var weighthit = 100;
				} else if (pokemon.weightkg >= 50) {
					var weighthit = 80;
				} else if (pokemon.weightkg >= 25) {
					var weighthit = 60;
				} else if (pokemon.weightkg >= 10) {
					var weighthit = 40;
				} else {
					var weighthit = 20;
				}
				var details = {
					"Dex#": pokemon.num,
					"Height": pokemon.heightm + " m",
					"Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
					"Dex Colour": pokemon.color,
					"Egg Group(s)": pokemon.eggGroups.join(", ")
				};
				if (!pokemon.evos.length) {
					details["<font color=#585858>Does Not Evolve</font>"] = "";
				} else {
					details["Evolution"] = pokemon.evos.map(function (evo) {
						var evo = Tools.getTemplate(evo);
						return evo.name + " (" + evo.evoLevel + ")";
					}).join(", ");
				}

		 	} else if (newTargets[0].searchType === 'move') {
				var move = Tools.getMove(newTargets[0].name);
				var details = {
					"Priority": move.priority,
				};

				if (move.secondary || move.secondaries) details["<font color=black>&#10003; Secondary Effect</font>"] = "";
				if (move.isContact) details["<font color=black>&#10003; Contact</font>"] = "";
				if (move.isBullet) details["<font color=black>&#10003; Bullet</font>"] = "";
				if (move.isPulseMove) details["<font color=black>&#10003; Pulse</font>"] = "";

				details["Target"] = {
					'normal': "Adjacent Pokemon",
					'self': "Self",
					'adjacentAlly': "Single Ally",
					'allAdjacentFoes': "Adjacent Foes",
					'foeSide': "All Foes",
					'allySide': "All Allies",
					'allAdjacent': "All Adjacent Pokemon",
					'any': "Any Pokemon",
					'all': "All Pokemon"
				}[move.target] || "Unknown";

			} else if (newTargets[0].searchType === 'item') {
				var item = Tools.getItem(newTargets[0].name);
				var details = {};
				if (item.fling) {
					details["Fling Base Power"] = item.fling.basePower;
					if (item.fling.status) details["Fling Effect"] = item.fling.status;
					if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
					if (item.isBerry) details["Fling Effect"] = "Activates effect of berry on target.";
					if (item.id === 'whiteherb') details["Fling Effect"] = "Removes all negative stat levels on the target.";
					if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of infatuation, Taunt, Encore, Torment, Disable, and Cursed Body on the target.";
				}
				if (!item.fling) details["Fling"] = "This item cannot be used with Fling";
				if (item.naturalGift) {
					details["Natural Gift Type"] = item.naturalGift.type;
					details["Natural Gift BP"] = item.naturalGift.basePower;
				}

			} else {
				var details = {};
			}

			buffer += '|raw|<font size="1">' + Object.keys(details).map(function (detail) {
				return '<font color=#585858>' + detail + (details[detail] !== '' ? ':</font> ' + details[detail] : '</font>');
			}).join("&nbsp;|&ThickSpace;") + '</font>';
		}
		this.sendReply(buffer);
	},

	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1, 'ou':1, 'uu':1, 'lc':1, 'cap':1, 'bl':1, 'bl2':1, 'ru':1, 'bl3':1, 'nu':1};
		var allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		var showAll = false;
		var megaSearch = null;
		var feSearch = null; // search for fully evolved pokemon only
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0, 1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
				if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
				megaSearch = !isNotSearch;
				continue;
			}

			if (target === 'fe' || target === 'fullyevolved' || target === 'nfe' || target === 'notfullyevolved') {
				if (target === 'nfe' || target === 'notfullyevolved') isNotSearch = !isNotSearch;
				if ((feSearch && isNotSearch) || (feSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include fully evolved Pokémon.');
				feSearch = !isNotSearch;
				continue;
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
				if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
					if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}
			return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null && feSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			var megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
			var feSearchResult = (feSearch === null || (feSearch === true && !template.evos.length) || (feSearch === false && template.evos.length))
			if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
				megaSearchResult && feSearchResult) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1, 'types':1, 'ability':1, 'tier':1, 'gen':1, 'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							var canLearn = (prevoTemp.learnset.sketch && !(move.id in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1})) || prevoTemp.learnset[move.id];
							if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
						}
					}
					break;

				default:
					return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function (speciesid) {return dex[speciesid].species;});
		results = results.filter(function (species) {
			var template = Tools.getTemplate(species);
			return !(species !== template.baseSpecies && results.indexOf(template.baseSpecies) > -1);
		});
		var resultsStr = "";
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(", ");
			} else {
				results.randomize()
				resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
			}
		} else {
			resultsStr = "No Pokémon found.";
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply("Pokemon '" + template.id + "' not found.");
		}

		if (targets.length < 2) {
			return this.sendReply("You must specify at least one move.");
		}

		for (var i = 1, len = targets.length; i < len; ++i) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply("Move '" + move.id + "' not found.");
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
		if (!problem) {
			var sourceNames = {E:"egg", S:"event", D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i = 0, len = sources.length; i < len; ++i) {
					var source = sources[i];
					if (source.substr(0, 2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": " + source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ", " + source.substr(2);
						else if (prevSourceCount === 3) buffer += ", ...";
						++prevSourceCount;
						continue;
					}
					prevSourceType = source.substr(0, 2);
					prevSourceCount = source.substr(2) ? 0 : -1;
					buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": " + source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function (target, room, user){
		if (!this.canBroadcast()) return;
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox("" + Tools.escapeHTML(target) + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod === 1) weaknesses.push(type);
				if (typeMod === 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox("" + target + " has no weaknesses.");
		} else {
			this.sendReplyBox("" + target + " is weak to: " + weaknesses.join(", ") + " (not counting abilities).");
		}
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i = 0; i < 2; ++i) {
			for (var method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				factor = Math.pow(2, Tools.getEffectiveness(source, defender));
			} else {
				factor = 1;
			}
		}

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
	},

	uptime: (function (){
		function formatUptime(uptime) {
			if (uptime > 24 * 60 * 60) {
				var uptimeText = "";
				var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
				uptimeText = uptimeDays + " " + (uptimeDays == 1 ? "day" : "days");
				var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
				if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
				return uptimeText;
			} else {
				return uptime.seconds().duration();
			}
		}

		return function(target, room, user) {
			if (!this.canBroadcast()) return;
			var uptime = process.uptime();
			this.sendReplyBox("Uptime: <b>" + formatUptime(uptime) + "</b>" +
				(global.uptimeRecord ? "<br /><font color=\"green\">Record: <b>" + formatUptime(global.uptimeRecord) + "</b></font>" : ""));
		};
	})(),

	groups: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />" +
			"% <b>Driver</b> - The above, and they can mute. Global % can also lock users and check for alts<br />" +
			"@ <b>Moderator</b> - The above, and they can ban users<br />" +
			"&amp; <b>Leader</b> - The above, and they can promote to moderator and force ties<br />" +
			"# <b>Room Owner</b> - They are leaders of the room and can almost totally control it<br />" +
			"~ <b>Administrator</b> - They can do anything, like change what this message says"
		);
	},

	git: 'opensource',
	opensource: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Lotus is open source:<br />" +
			"- <a href=\"https://github.com/mac-BJ-Server/naten-serv\">Server source code</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown-Client\">Client source code</a>"
		);
	},

	mainstaff: function (target, room, user) {
	    if (!this.canBroadcast()) return;
	    this.sendReplyBox("<a href=\"http://www.smogon.com/sim/staff_list\">Pokemon Showdown! Official Server Staff List</a>");
	},

	avatars: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can <button name="avatars">change your avatar</button> by clicking on it in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right. Custom avatars are only obtainable by staff.');
	},

	showtan: function (target, room, user) {
		if (!user.name == 'macrarazy') return this.sendReply("The command '/showtan' was unrecognized. To send a message starting with '/showtan', type '//showtan'.");
		target = this.splitTarget(target);
		if (!this.targetUser) return this.sendReply('/showtan - User '+this.targetUser.name+' not found.');
		this.targetUser.avatar = '#showtan';
		this.sendReply('/showtan - You applied showtan to affected area of '+this.targetUser.name+'.');
	},

	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"New to competitive pokemon?<br />" +
			"- <a href=\"http://www.smogon.com/sim/ps_guide\">Beginner's Guide to Pokémon Showdown</a><br />" +
			"- <a href=\"http://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive Pokémon</a><br />" +
			"- <a href=\"http://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
			"- <a href=\"http://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
		);
	},

	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Welcome to Smogon's official simulator! Here are some useful links to <a href=\"http://www.smogon.com/mentorship/\">Smogon\'s Mentorship Program</a> to help you get integrated into the community:<br />" +
			"- <a href=\"http://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
			"- <a href=\"http://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
			"- <a href=\"http://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
			"- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a>"
		);
	},

	calculator: 'calc',
	calc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
			"- <a href=\"http://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
		);
	},

	cap: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"An introduction to the Create-A-Pokemon project:<br />" +
			"- <a href=\"http://www.smogon.com/cap/\">CAP project website and description</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=3464513\">Talk about the metagame here</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=3466826\">Practice BW CAP teams</a>"
		);
	},

	gennext: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
			"Example replays:<br />" +
			"- <a href=\"http://replay.pokemonshowdown.com/gennextou-120689854\">Zergo vs Mr Weegle Snarf</a><br />" +
			"- <a href=\"http://replay.pokemonshowdown.com/gennextou-130756055\">NickMP vs Khalogie</a>"
		);
	},
	
	megas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw| <center><table border="1" style="width:300px"><tr><td><b>NAME</b></td><td><b>STATS</b></td><td><b>ABILITY</b></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/003.shtml#mega">Mega Venusaur</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />80 - 100 - 123 - 122 - 120 - 80</td><td>Thick Fat</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/006.shtml#mega">Mega Charizard X</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />78 - 130 - 111 - 130 - 85 - 100</td><td>Tough Claws</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/006.shtml#mega">Mega Charizard Y</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />78 - 104 - 78 - 159 - 115 - 100</td><td>Drought</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/009.shtml#mega">Mega Blastoise</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />79 - 103 - 120 - 135 - 115 - 78</td><td>Mega Launcher</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/065.shtml#mega">Mega Alakazam</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />55 - 50 - 65 - 175 - 95 - 150</td><td>Trace</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/094.shtml#mega">Mega Gengar</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />60 - 65 - 80 - 170 - 95 - 130</td><td>Shadow Tag</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/115.shtml#mega">Mega Kangaskhan</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />105 - 125 - 100 - 60 - 100 - 100</td><td>Parental Bond</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/127.shtml#mega">Mega Pinsir</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />65 - 155 - 120 - 65 - 90 - 105</td><td>Aerilate</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/130.shtml#mega">Mega Gyarados</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />95 - 155 - 109 - 70 - 130 - 81</td><td>Mold Breaker</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/142.shtml#mega">Mega Aerodactyl</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />80 - 135 - 85 - 70 - 95 - 150</td><td>Tough Claws</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/150.shtml#mega">Mega Mewtwo X</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />106 - 190 - 100 - 154 - 100 - 130</td><td>Steadfast</td></tr>' +
			  '<tr><td><a href="http://www.serebii.net/pokedex-xy/150.shtml#mega">Mega Mewtwo Y</a></td><td><font color=grey>HP - Atk - Def - SpA - SpD - Spe</font><br />106 - 150 - 70 - 194 - 120 - 140</td><td>Insomnia</td></tr>' +
			  '</table>' +
			  '<b>Still in beta!</b></center>');
	},
	
	/*megas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var aliases = {
			kanto: 1,
			johto: 2,
			hoenn: 3,
			sinnoh: 4,
			unova: 5,
			kalos: 6,
			};
			target = toId(target);
			if (!aliases[target]) {
				this.sendReply('/megas - Error, kindly check if you\'re doing it right!');
				}
				var gen = aliases[target];
				var results = [];
				for (var p in Tools.data.Pokedex) {
					var template = Tools.getTemplate(p);
					if (!p.isMega) continue;
					if (Tools.getTemplate(p.baseSpecies).gen === gen) results.push(p.species);
					}
					// whatever post-processing you want here
					// this is a really basic and inefficient way of doing it but it illustrates how to do it
	},*/
	
	isak: function (target, room, user) {
		if (!user.name == 'Ace Champ Tyga') return false;
		this.parse('/join monotye');
		this.parse('/roomunban macrarazy');
		this.parse('/leave monotype');
	},
	
	hex: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if(!target){
			this.sendReplyBox('<center><b>Your name\'s hexcode is:<font color="'+hashColor(''+toId(user.name)+'')+'"> '+hashColor(''+toId(user.name)+''));
			return;
		};
		if(target.indexOf('#') < 0){
			this.sendReplyBox('Please include the \'#\' symbol');
			return false;
		};
		var verify = /^#[0-9A-F]{6}$/i;
		if(verify.test(target)){
			this.sendReplyBox('<center><b><font size="5" color="' + target + '">' + target + '</font></b></center>');
		}else{
			this.sendReplyBox('Could not find a valid color to match your hex code');
		};
	},

	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
			}
		}
		if (target === 'all' || target === 'omofthemonth' || target === 'omotm' || target === 'month') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
		}
		if (target === 'all' || target === 'pokemonthrowback' || target === 'throwback') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3510401/\">Pokémon Throwback</a><br />";
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3510149/\">Balanced Hackmons Threatlist</a><br />";
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3499973/\">Balanced Hackmons Mentoring Program</a><br />";
			}
		}
		if (target === 'all' || target === '1v1') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
		}
		if (target === 'all' || target === 'oumonotype' || target === 'monotype') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3493087/\">OU Monotype</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3507565/\">OU Monotype Viability Rankings</a><br />";
			}
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
		}
		if (target === 'all' || target === 'almostanyability' || target === 'aaa') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3495737/\">Almost Any Ability</a><br />";
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3510465/\">STABmons Threatlist</a><br />";
			}
		}
		if (target === 'all' || target === 'skybattles' || target === 'skybattle') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3493601/\">Sky Battles</a><br />";
		}
		if (target === 'all' || target === 'inversebattle' || target === 'inverse') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3492433/\">Inverse Battle</a><br />";
		}
		if (target === 'all' || target === 'hackmons' || target === 'ph') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
		}
		if (target === 'middlecup' || target === 'mc') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
		}
		if (target === 'glitchmons') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3467120/\">Glitchmons</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
		}
		this.sendReplyBox(buffer);
	},
	
	links: 'hlinks',
	helpful: 'hlinks',
	helpfullinks: 'hlinks',
	hlinks: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox('<font color=green><b>Helpful links related to the server:</b></font><br />' +
			'- <a href="http://lotus-server.weebly.com/"><font color=green>Website</font></a><br />' +
			'- <a href="https://w11.zetaboards.com/PS_Lotus/index/"><font color=orange>Forums</font></a><br />' +
			'- <a href="https://github.com/mac-BJ-Services/naten-serv/"><font color=blue>GitHub</font></a> (server code)');
	},

	roomhelp: function (target, room, user) {
		if (room.id === 'lobby' || room.battle) return this.sendReply("This command is too spammy for lobby/battles.");
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Room drivers (%) can use:<br />" +
			"- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />" +
			"- /mute OR /m <em>username</em>: 7 minute mute<br />" +
			"- /hourmute OR /hm <em>username</em>: 60 minute mute<br />" +
			"- /unmute <em>username</em>: unmute<br />" +
			"- /announce OR /wall <em>message</em>: make an announcement<br />" +
			"- /modlog <em>username</em>: search the moderator log of the room<br />" +
			"- /modnote <em>note</em>: adds a moderator note that can be read through modlog<br/>" +
			"<br />" +
			"Room moderators (@) can also use:<br />" +
			"- /roomban OR /rb <em>username</em>: bans user from the room<br />" +
			"- /roomunban <em>username</em>: unbans user from the room<br />" +
			"- /roomvoice <em>username</em>: appoint a room voice<br />" +
			"- /roomdevoice <em>username</em>: remove a room voice<br />" +
			"- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />" +
			"<br />" +
			"Room owners (#) can also use:<br />" +
			"- /roomintro <em>intro</em>: sets the room introduction that will be displayed for all users joining the room<br />" +
			"- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />" +
			"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />" +
			"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />" +
			"- /modchat <em>[%/@/#]</em>: set modchat level<br />" +
			"- /declare <em>message</em>: make a large blue declaration to the room<br />" +
			"- !htmlbox <em>HTML code</em>: broadcasts a box of HTML code to the room<br />" +
			"- !showimage <em>[url], [width], [height]</em>: shows an image to the room<br />" +
			"<br />" +
			"The room founder (#) can also use:<br />" +
			"- /roomowner <em>username</em><br />" +
			"- /roomdeowner <em>username</em><br />" +
			"</div>"
		);
	},

	restarthelp: function (target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"The server is restarting. Things to know:<br />" +
			"- We wait a few minutes before restarting so people can finish up their battles<br />" +
			"- The restart itself will take around 0.6 seconds<br />" +
			"- Your ladder ranking and teams will not change<br />" +
			"- We are restarting to update Pokémon Showdown to a newer version"
		);
	},

	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("Please follow the rules:<br />" +
				(room.rulesLink ? "- <a href=\"" + Tools.escapeHTML(room.rulesLink) + "\">" + Tools.escapeHTML(room.title) + " room rules</a><br />" : "") +
				"- <a href=\"http://pokemonshowdown.com/rules\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
			return;
		}
		if (!this.can('roommod', null, room)) return;
		if (target.length > 80) {
			return this.sendReply("Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.");
		}

		room.rulesLink = target.trim();
		this.sendReply("(The room rules link is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/staff_faq\">Staff FAQ</a><br />";
		}
		if (target === 'all' || target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
		}
		if (!matched) {
			return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3496305/\">Ubers Viability Ranking Thread</a><br />";
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3509824/\">np: OU Stage 4</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3502428/\">OU Viability Ranking Thread</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3491371/\">Official OU Banlist</a><br />";
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3508311/\">np: UU Stage 2</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3500340/\">UU Viability Ranking Thread</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3502698/#post-5323505\">Official UU Banlist</a><br />";
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3510066/\">np: RU Stage 2</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3506500/\">RU Viability Ranking Thread</a><br />";
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3506287/\">np: NU (beta)</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3509494/\">NU Viability Ranking Thread</a><br />";
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3496013/\">LC Viability Ranking Thread</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3490462/\">Official LC Banlist</a><br />";
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3509279/\">np: Doubles Stage 3.5</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3496306/\">Doubles Viability Ranking Thread</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3498688/\">Official Doubles Banlist</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"http://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || 'xy').trim().toLowerCase();
		var genNumber = 6;
		// var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'vgc2014':1, 'doubles':1};
		var doublesFormats = {};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === 'xy' || generation === 'xy' || generation === '6' || generation === 'six') {
			generation = 'xy';
		} else if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
			generation = 'bw';
			genNumber = 5;
		} else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
			generation = 'dp';
			genNumber = 4;
		} else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
			generation = 'rs';
			genNumber = 3;
		} else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
			generation = 'gs';
			genNumber = 2;
		} else if(generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'xy';
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1, 'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':"VGC 2012", 'vgc2013':"VGC 2013", 'vgc2014':"VGC 2014", 'doubles':"Doubles"}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
			}
			// if (pokemon.tier === 'CAP') generation = 'cap';
			if (pokemon.tier === 'CAP') return this.sendReply("CAP is not currently supported by Smogon Strategic Pokedex.");

			var illegalStartNums = {'351':1, '421':1, '487':1, '493':1, '555':1, '647':1, '648':1, '649':1, '681':1};
			if (pokemon.isMega || pokemon.num in illegalStartNums) pokemon = Tools.getTemplate(pokemon.baseSpecies);
			var poke = pokemon.name.toLowerCase().replace(/\ /g, '_').replace(/[^a-z0-9\-\_]+/g, '');

			this.sendReplyBox("<a href=\"http://www.smogon.com/dex/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/dex/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/dex/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/dex/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		if (!atLeastOne) {
			return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
		}
	},
	
	/*********************************************************
	 * Trainer cards Shrek is Love Shrek is Life
	 *********************************************************/
	
	couple: function(target, room, user) {
    		if (!this.canBroadcast()) return;
    		this.sendReplyBox('<center><img src="https://1-media-cdn.foolz.us/ffuuka/board/vp/image/1389/99/1389993289798.png" width="130">' +
    			'<img src="http://i.imgur.com/7vNiKOM.gif">' +
    			'<img src="http://i.imgur.com/lRlU8KQ.gif" width="130"><br />' +
    			'You know it\'s true love when you give each other nicknames such as, Bitch, Slut and Whore.</center>');
    	},
	
	naten: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/uxie.gif">' +
			'<img src="http://i254.photobucket.com/albums/hh108/naten2006/cooltext1400784365_zps7b67e8c9.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mew.gif"><br />' +
			'Ace: Uxie, Our Lord and Saviour<br />' +
			'<font color="purple">The moment you\'ve stopped planning ahead is the moment you\'ve given up.</font></center>');
	},
	
	mating: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i254.photobucket.com/albums/hh108/naten2006/oie_1944237QcDokLVq_zps0977c0b9.gif">' +
			'<img src="http://i254.photobucket.com/albums/hh108/naten2006/cooltext1482514275_zps4e7ca2e6.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kecleon.gif"><br />' +
			'<b>Aces:</b> Uxie and Kecleon<br />' +
			'<font color=purple>Maten (pronounced Mating): Now and Forever.</font></center>');
	},
	
	ag: 'arcainiagaming',
	arcainiagaming: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/tFikucg.png"><br />' +
			'<img src="http://i.imgur.com/wSs98Iy.gif"><br />' +
			'<font color="red"><blink>Ace: Weavile</blink></font><br />' +
			'I\'m not even on drugs. I\'m just weird.</center>');
	},
	
	elitefourbalto : 'balto', 
	balto: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="90" src="http://fc08.deviantart.net/fs71/f/2012/035/e/f/snorlax_by_all0412-d4omc96.jpg">' +
			'<img src="http://i.imgur.com/gcbLD9A.png">' +
			'<img src="http://fc04.deviantart.net/fs71/f/2013/223/3/b/mega_kangaskhan_by_peegeray-d6hnnmk.png" height="100"><br />' +
			'<b>Ace: </b>Snorlax<br />' +
			'<b>Catchphrase: </b>To be a championship player,you need a championship team.</center>');
	},
	
	aeon: 'glisteringaeon',
	glisteringaeon: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Trainer: Glistering Aeon<br />' +
			'Ace: Really? Duh.<br />' +
			'Catchphrase: Grab your sombreros and glow sticks and lets rave!<br />' +
			'<img height="150" src="http://www.animeyume.com/ludicolo.jpg"></center>');
	},
	
	sss: 'isawa',
	kurushi: 'isawa',
	piers: 'isawa',
	isawa: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/hwqR2b8.jpg" width="160" height="140">' +
			'<img src="http://i.imgur.com/qZvvpNG.png?1" width="220">' +
			'<img src="http://farm3.static.flickr.com/2755/4122651974_353e4287e8.jpg" width="160" height="130"><br />' +
			'<b>Ace:</b> Piers Nivans<br />' +
			'Rub-a-dub-dub, Isawa be in your tub</center>');
	},
	
	kafka: 'kafkablack',
	kafkablack: function(target, room, user) {
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<center><img src="http://i.imgur.com/bvCvPmd.gif"><br />' +
			'<font size="3"><b><i><font color="CCCC33">Kafka</i><br></font><b><br />' +
			'<blink>Ace: Shimmy</blink></b><br />' +
			'<b>Stop, oh, and wiggle with it. YEAHHH!</b></center>');
        },
	
	mac: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7w8sY92.png" width="145" height=140><img src=http://i.imgur.com/LLFGr9y.png width=235 height=169><img src="http://i.imgur.com/kyPzqAv.png" width="145" height=140><br />' +
		'<b>Ace:</b> <font color="green">Kecleon</font><br />' +
		'<font color=#ff0000">Y</font><font color=#ff2100">o</font><font color=#ff4200">u</font><font color=#ff6300"></font><font color=#ff8500">l</font><font color=#ffa600">l</font> ' +
		'<font color=#ffe800">N</font><font color=#f3ff00">e</font><font color=#d2ff00">v</font><font color=#b1ff00">e</font><font color=#90ff00">r</font> ' +
		'<font color=#4dff00">F</font><font color=#2cff00">i</font><font color=#0bff00">n</font><font color=#00ff16">d</font> ' +
		'<font color=#00ff58">A</font><font color=#00ff79">n</font><font color=#00ff9b">y</font><font color=#00ffbc">o</font><font color=#00ffdd">n</font><font color=#00feff">e</font> ' +
		'<font color=#00bcff">M</font><font color=#009bff">o</font><font color=#0079ff">r</font><font color=#0058ff">e</font> ' +
		'<font color=#0016ff">F</font><font color=#0b00ff">a</font><font color=#2c00ff">b</font><font color=#4d00ff">u</font><font color=#6e00ff">l</font><font color=#9000ff">o</font><font color=#b100ff">u</font><font color=#d200ff">s</font> ' +
		'<font color=#ff00e8">T</font><font color=#ff00c7">h</font><font color=#ff00a6">a</font><font color=#ff0085">n</font> ' +
		'<font color=#ff0042">M</font><font color=#ff0021">e</font></center>');
	},
	
	macra: 'macrarazy',
        professormac: 'macrarazy',
	macrarazy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://media-cerulean.cursecdn.com/attachments/thumbnails/5/622/530/530/mega_lucario.png" height="180" width="150"><br />' +
                '<img src="http://th03.deviantart.net/fs70/PRE/i/2014/003/8/1/mega_aggron_by_theangryaron-d70p759.png" height="130" width="150"> <img src="http://i.imgur.com/91GZs2L.gif"> <img src="http://fc06.deviantart.net/fs70/f/2013/285/4/7/mega_aggron_tramplin__the_lawn_by_brandon_stuart-d6q5051.png" height="130" width="160"><br />' +
		'<b><blink>Ace: Mega Aggron</blink><br />' +
		'<font color=gray>Sometimes... Steel is too much for you!</font></b>');
	},
	
	mascot: function(target, room, user) {
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<center><img src="http://fc02.deviantart.net/fs71/f/2011/049/a/a/lilypad_foot_by_pinkophilic-d39utbl.png" width="162" height="121"><br />' +
			'<b><font color=#ff0000">M</font><font color=#ff2100">a</font><font color=#ff4200">s</font><font color=#ff6300">c</font><font color=#ff8500">o</font><font color=#ffa600">t</font> ' +
			'<font color=#ffe800">o</font><font color=#f3ff00">f</font> ' +
			'<font color=#d2ff00">t</font><font color=#b1ff00">h</font><font color=#90ff00">e</font> ' +
			'<font color=#4dff00">L</font><font color=#2cff00">o</font><font color=#0bff00">t</font><font color=#00ff16">u</font><font color=#00ff58">s</font> ' +
			'<font color=#00ff79">S</font><font color=#00ff9b">e</font><font color=#00ffbc">r</font><font color=#00ffdd">v</font><font color=#00feff">e</font><font color=#00feeg">r</font> ' +
			'</b></center>');
	},
	
	mating: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i254.photobucket.com/albums/hh108/naten2006/oie_1944237QcDokLVq_zps0977c0b9.gif">' +
			'<img src="http://i254.photobucket.com/albums/hh108/naten2006/cooltext1482514275_zps4e7ca2e6.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kecleon.gif"><br />' +
			'<b>Aces:</b> Uxie and Kecleon<br />' +
			'<font color=purple>Maten (pronounced Matin\'): Now and Forever.</font></center>');
	},
	
	fishy: 'piscean',
	piscean: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/spheal.gif">' +
			'<img src="http://i.imgur.com/iR3xhAH.gif">' +
			'<img src="http://th01.deviantart.net/fs70/200H/f/2011/010/a/b/derp_spheal_by_keijimatsu-d36um8a.png" width="110" height="100"><br />' +
			'<b>Ace:</b> Derp<br />' +
			'<b>Catchphrase:</b> What am I supposed to do with this shit?</center>');
	},
	
	priest: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/pHVCLC5.png" width="140" height="100">' +
			'<img src="http://i.imgur.com/BkVihDY.png">' +
			'<img src="http://i.imgur.com/f39NE2W.gif"><br />' +
			'<font color="red"><blink>Ace: Heatran</blink></font><br />' +
			'Are you ready to face holyness itself? Will you open the door to my temple? Let your chakras make the decision for you.</center>');
	},
	
	high: 'princesshigh',
	princesshigh: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://31.media.tumblr.com/tumblr_ltuo9yFLI81r5wm28o1_250.gif">' +
			'<img src="http://i.imgur.com/0xsg2uK.gif" width="370">' +
			'<img src="http://31.media.tumblr.com/tumblr_ltuo9yFLI81r5wm28o1_250.gif" ><br />' +
			'<b>Ace:</b> <font color=#d63265><blink>Gardevior</blink></font><br />' +
			'<b><font color=#ff0000">L</font><font color=#ff2300">i</font><font color=#ff4700">v</font><font color=#ff6a00">e</font>' +
			'<font color=#ff8e00"> </font><font color=#ffb100">f</font><font color=#ffb100">a</font><font color=#ffd500">s</font>' +
			'<font color=#ffd500">t</font><font color=#bdff00">,</font><font color=#9aff00"> </font><font color=#76ff00">D</font>' +
			'<font color=#53ff00">i</font><font color=#2fff00">e</font><font color=#0bff00"> </font><font color=#00ff17">y</font>' +
			'<font color=#00ff3b">o</font><font color=#00ff5e">u</font><font color=#00ff82">n</font><font color=#00ffa6">g</font>' +
			'<font color=#00ffc9">,</font><font color=#00ffed"> </font><font color=#00edff">b</font><font color=#00c9ff">a</font>' +
			'<font color=#00a6ff">d</font><font color=#0082ff"> </font><font color=#005eff">g</font><font color=#003bff">i</font>' +
			'<font color=#0017ff">r</font><font color=#0b00ff">l</font><font color=#2f00ff">s</font><font color=#5300ff"> </font>' +
			'<font color=#7600ff">d</font><font color=#9a00ff">o</font><font color=#bd00ff"> </font><font color=#e100ff">i</font>' +
			'<font color=#ff00f9">t</font><font color=#ff00d5"> </font><font color=#ff00b1">w</font><font color=#ff008e">e</font>' +
			'<font color=#ff006a">l</font><font color=#ff0047">l</font><font color=#ff0023">.</font></b></center>');
	},
	
	receptionist: 'recep',
	receptionist147: 'recep',
	recep: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/48CvnKv.gif" height="80" width="440"></center><br />' +
			'<center><center><img src="http://gifstumblr.com/images/the-party-doesnt-start-till-i-walk-in_1087.gif" height="264" width="486"></center><br />' +
			'<center><b>Ace:</b> Patrick</center><br />' +
			'<center><b>Catchphrase:</b> KafkaBlack has been kicked from room by Receptionist147.</center>');
	},
	
	shofu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://static2.businessinsider.com/image/508807266bb3f70f5d000000/15-things-that-make-barack-obama-sad.jpg" height="357" width="476"><br />' +
			'<img src="http://pbs.twimg.com/profile_images/1538004667/Document0002.png" height="90" width="90"><br />' +
			'<b><blink>Ace: Darniggatan</blink></b><br />' +
			'<b>The realest nigga you have ever seen</b>');
	},
	
	sk: 'silverkill',
	silverkill: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=150 src="http://fc00.deviantart.net/fs70/f/2013/320/9/3/mega_scizor_by_silentgpanda-d6ujsmg.jpg">' +
			'<img src="http://frostserver.no-ip.org:8000/images/silverkill-tc.png">' +
			'<img height=150 src="https://1-media-cdn.foolz.us/ffuuka/board/vp/image/1367/35/1367354021540.jpg"><br />' +
			'<b>Ace: </b>Mo\' Fuckin\' Common Sense!<br />' +
			'<b>Quote: </b>Would you like some fresh cut nanis? No? Well your mom bought some. She LOVED it ;D</center>');
	},
	
	/*********************************************************
	 * Fun commands
	 *********************************************************/
	
	poke: function(target, room, user){
		if(!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me pokes ' + target + '.');
	},

	slap: function(target, room, user){
		if(!target) return this.sendReply('/slap needs a target.');
		return this.parse('/me slaps ' + target + ' in the face with a slipper!');
	},
	
	s: 'spank',
	spank: function(target, room, user){
		if(!target) return this.sendReply('/spank needs a target.');
		return this.parse('/me spanks ' + target + '!');
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	potd: function (target, room, user) {
		if (!this.can('promote')) return false;

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
		}
	},

	roll: 'dice',
	dice: function (target, room, user) {
		if (!target) return this.parse('/help dice');
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0, d));
			var faces;
			if (target.length > d) faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = [];
			var total = 0;
			for (var i = 0; i < num; ++i) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
	},

	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		var options = target.split(',');
		if (options.length < 2) return this.parse('/help pick');
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<em>We randomly picked:</em> ' + Tools.escapeHTML(options.sample().trim()));
	},
	
	spam: 'spamroom',
	spamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.targetUser) {
			return this.sendReply("The user '" + this.targetUsername + "' does not exist.");
		}
		if (!this.can('mute', this.targetUser)) {
			return false;
		}

		var targets = Spamroom.addUser(this.targetUser);
		if (targets.length === 0) {
			return this.sendReply("That user's messages are already being redirected to the spamroom.");
		}
		this.privateModCommand("(" + user.name + " has added to the spamroom user list: " + targets.join(", ") + ")");
	},

	unspam: 'unspamroom',
	unspamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.can('mute')) {
			return false;
		}

		var targets = Spamroom.removeUser(this.targetUser || this.targetUsername);
		if (targets.length === 0) {
			return this.sendReply("That user is not in the spamroom list.");
		}
		this.privateModCommand("(" + user.name + " has removed from the spamroom user list: " + targets.join(", ") + ")");
	},

	register: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right.');
	},

	lobbychat: function (target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply("You are now blocking lobby chat.");
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply("You are now receiving lobby chat.");
		}
	},

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('promote', null, room)) return false;
		if (!this.canBroadcast()) return;

		targets = target.split(',');
		if (targets.length != 3) {
			return this.parse('/help showimage');
		}

		this.sendReply('|raw|<img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
	},

	htmlbox: function (target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		if (!this.can('promote', null, room)) return;
		if (!this.canHTML(target)) return;
		if (!this.canBroadcast('!htmlbox')) return;

		this.sendReplyBox(target);
	},
	
	mate: function (target, room, user) {
		if (!this.isStaff && user.name == 'macrarazy' || user.name == 'kafkablack' || user.name == 'freelancermac' || user.name == 'brittlewind' || user.name == 'naten2006') return;
		this.sendReply('/mate - You are now recognized. You will shortly join it, have fun!');
		this.parse('/join mating');
	},

	a: function (target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'all' || target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'details' || target === 'dt') {
			matched = true;
			this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
			this.sendReply("!details [pokemon] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the + % @ & next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'calc' || target === 'calculator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'blockchallenges' || target === 'idle') {
			matched = true;
			this.sendReply("/blockchallenges - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'all' || target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'all' || target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
			this.sendReply("!effectiveness OR /matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
		}
		if (target === 'all' || target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'all' || target === 'pick' || target === 'pickrandom') {
			matched = true;
			this.sendReply("/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.");
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'all' || target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}
		if (target === 'all' || target === 'profile') {
			matched = true;
			this.sendReply("/profile [username] - Shows infomation about the user.");
		}
		if (target === 'all' || target === 'about' || target === 'setabout') {
			matched = true;
			this.sendReply("/about [information] - Set a description about you for your profile.");
		}
		if (target === 'all' || target === 'transfermoney' || target === 'transferbuck' || target === 'transferbucks') {
			matched = true;
			this.sendReply("/transfermoney [username], [amount] - Transfer a certain amount of money to another user.");
		}
		if (target === 'all' || target === 'buy') {
			matched = true;
			this.sendReply("/buy [command] - Buys something from the shop.");
		}
		if (target === 'all' || target === 'poll') {
			matched = true;
			this.sendReply("/poll [question], [option], [option], etc. - Creates a poll.");
		}
		if (target === 'all' || target === 'vote') {
			matched = true;
			this.sendReply("/vote [option] - votes for the specified option in the poll.");
		}
		if (target === 'all' || target === 'regdate') {
			matched = true;
			this.sendReply("/regdate [username] - Shows registeration date of a user.");
		}
		if (target === 'all' || target === 'pmall' || target === 'masspm') {
			matched = true;
			this.sendReply("/pmall [message] - Sends a message to all users in the server.");
		}
		if (target === 'all' || target === 'tell') {
			matched = true;
			this.sendReply("/tell [username], [message] - Tells a message to a user.");
		}
		if (target === 'all' || target === 'customsymbol') {
			matched = true;
			this.sendReply("/customsymbol [symbol] - Changes your symbol (usergroup) to the specified symbol. The symbol can only be one character.");
		}
		if (target === 'all' || target === 'urbandefine' || target === 'ud') {
			matched = true;
			this.sendReply("/urbandefine [phrase] - Looks up this phrase on urbandictionary.com.");
		}
		if (target === 'all' || target === 'define' || target === 'def') {
			matched = true;
			this.sendReply("/define [word] - Looks up this word on the internet.");
		}
		if (target === 'all' || target === 'emoticon' || target === 'emoticons') {
			matched = true;
			this.sendReply("/emoticons - Displays all emoticons available.");
		}
		if (target === '%' || target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~");
		}
		if (target === '%' || target === 'unlock') {
			matched = true;
			this.sendReply("/unlock [username] - Unlocks the user. Requires: % @ & ~");
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply("/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~");
		}
		if (target === '%' || target === 'modnote') {
			matched = true;
			this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~");
		}
		if (target === '%' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~");
		}
		if (target === '@' || target === 'roomban' || target === 'rb') {
			matched = true;
			this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: @ & ~");
		}
		if (target === '@' || target === 'roomunban') {
			matched = true;
			this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: @ & ~");
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~");
		}
		if (target === '@' || target === '#' || target === 'roompromote') {
			matched = true;
			this.sendReply("/roompromote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: @ # & ~");
		}
		if (target === '@' || target === '#' || target === 'roomdemote') {
			matched = true;
			this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: @ # & ~");
		}
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === '&' || target === 'unbanip') {
			matched = true;
			this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: @ & ~");
		}
		if (target === '&' || target === 'unbanall') {
			matched = true;
			this.sendReply("/unbanall - Unban all IP addresses. Requires: & ~");
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: % @ & ~");
		}
		if (target === "%" || target === 'kickbattle ') {
			matched = true;
			this.sendReply("/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: % @ & ~");
		}
		if (target === "%" || target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~");
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ & ~");
		}
		if (target === '%' || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ & ~");
		}
		if (target === '%' || target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unmute [username] - Removes mute from user. Requires: % @ & ~");
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~");
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~");
		}
		if (target === '&' || target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: & ~");
		}
		if (target === '&' || target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: & ~");
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: & ~");
		}
		if (target === '~' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~");
		}
		if (target === '~' || target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~");
		}
		if (target === '~' || target === 'htmlbox') {
			matched = true;
			this.sendReply("/htmlbox [message] - Displays a message, parsing HTML code contained. Requires: ~ # with global authority");
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~");
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply("/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options");
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~");
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~");
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~");
		}
		if (target === '~' || target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~");
		}
		if (target === '~' || target === 'makechatroom') {
			matched = true;
			this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~");
		}
		if (target === '~' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~");
		}
		if (target === '~' || target === 'roomowner') {
			matched = true;
			this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~");
		}
		if (target === '~' || target === 'roomdeowner') {
			matched = true;
			this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: ~");
		}
		if (target === '~' || target === 'privateroom') {
			matched = true;
			this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: ~");
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (target === '~' || target === 'givemoney' || target === 'givebuck' || target === 'givebucks') {
			matched = true;
			this.sendReply("/givemoney [username], [amount] - Gives money to a user. Requires: ~");
		}
		if (target === '~' || target === 'takemoney' || target === 'takebuck' || target === 'takebucks') {
			matched = true;
			this.sendReply("/takemoney [username], [amount] - Takes money from a user. Requires: ~");
		}
		if (target === '~' || target === 'sudo') {
			matched = true;
			this.sendReply("/sudo [username], [message/command] - Makes another player perform a command (or speak) as if they typed it in the chat box themselves. Requires: ~");
		}
		if (target === '~' || target === 'kick') {
			matched = true;
			this.sendReply("/kick [username] - Kicks a username from the room. Requires: ~");
		}
		if (target === '~' || target === 'control') {
			matched = true;
			this.sendReply("/control [username], [say/pm], [message/user that you want to pm to], [pm message] - Controls what the user says and pm. Requires: ~");
		}
		if (target === '~' || target === 'controlpanel' || target === 'cp') {
			matched = true;
			this.sendReply("/controlpanel - Displays settings to be editted by adminstration. Requires: ~");
		}
		if (target === '~' || target === 'clearall') {
			matched = true;
			this.sendReply("/clearall - Clears all messages in the room. Requires: ~");
		}
		if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))");
			this.sendReply("For details on all room commands, use /roomhelp");
			this.sendReply("For details on all commands, use /help all");
			if (user.group !== Config.groupsranking[0]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
				this.sendReply("For details on all moderator commands, use /help @");
			}
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("The command '" + target + "' was not found. Try /help for general help");
		}
	},

};
function MD5(e){function t(e,t){var n,r,i,s,o;i=e&2147483648;s=t&2147483648;n=e&1073741824;r=t&1073741824;o=(e&1073741823)+(t&1073741823);return n&r?o^2147483648^i^s:n|r?o&1073741824?o^3221225472^i^s:o^1073741824^i^s:o^i^s}function n(e,n,r,i,s,o,u){e=t(e,t(t(n&r|~n&i,s),u));return t(e<<o|e>>>32-o,n)}function r(e,n,r,i,s,o,u){e=t(e,t(t(n&i|r&~i,s),u));return t(e<<o|e>>>32-o,n)}function i(e,n,r,i,s,o,u){e=t(e,t(t(n^r^i,s),u));return t(e<<o|e>>>32-o,n)}function s(e,n,r,i,s,o,u){e=t(e,t(t(r^(n|~i),s),u));return t(e<<o|e>>>32-o,n)}function o(e){var t="",n="",r;for(r=0;r<=3;r++)n=e>>>r*8&255,n="0"+n.toString(16),t+=n.substr(n.length-2,2);return t}var u=[],a,f,l,c,h,p,d,v,e=function(e){for(var e=e.replace(/\r\n/g,"\n"),t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):(r>127&&r<2048?t+=String.fromCharCode(r>>6|192):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128)),t+=String.fromCharCode(r&63|128))}return t}(e),u=function(e){var t,n=e.length;t=n+8;for(var r=((t-t%64)/64+1)*16,i=Array(r-1),s=0,o=0;o<n;)t=(o-o%4)/4,s=o%4*8,i[t]|=e.charCodeAt(o)<<s,o++;i[(o-o%4)/4]|=128<<o%4*8;i[r-2]=n<<3;i[r-1]=n>>>29;return i}(e);h=1732584193;p=4023233417;d=2562383102;v=271733878;for(e=0;e<u.length;e+=16)a=h,f=p,l=d,c=v,h=n(h,p,d,v,u[e+0],7,3614090360),v=n(v,h,p,d,u[e+1],12,3905402710),d=n(d,v,h,p,u[e+2],17,606105819),p=n(p,d,v,h,u[e+3],22,3250441966),h=n(h,p,d,v,u[e+4],7,4118548399),v=n(v,h,p,d,u[e+5],12,1200080426),d=n(d,v,h,p,u[e+6],17,2821735955),p=n(p,d,v,h,u[e+7],22,4249261313),h=n(h,p,d,v,u[e+8],7,1770035416),v=n(v,h,p,d,u[e+9],12,2336552879),d=n(d,v,h,p,u[e+10],17,4294925233),p=n(p,d,v,h,u[e+11],22,2304563134),h=n(h,p,d,v,u[e+12],7,1804603682),v=n(v,h,p,d,u[e+13],12,4254626195),d=n(d,v,h,p,u[e+14],17,2792965006),p=n(p,d,v,h,u[e+15],22,1236535329),h=r(h,p,d,v,u[e+1],5,4129170786),v=r(v,h,p,d,u[e+6],9,3225465664),d=r(d,v,h,p,u[e+11],14,643717713),p=r(p,d,v,h,u[e+0],20,3921069994),h=r(h,p,d,v,u[e+5],5,3593408605),v=r(v,h,p,d,u[e+10],9,38016083),d=r(d,v,h,p,u[e+15],14,3634488961),p=r(p,d,v,h,u[e+4],20,3889429448),h=r(h,p,d,v,u[e+9],5,568446438),v=r(v,h,p,d,u[e+14],9,3275163606),d=r(d,v,h,p,u[e+3],14,4107603335),p=r(p,d,v,h,u[e+8],20,1163531501),h=r(h,p,d,v,u[e+13],5,2850285829),v=r(v,h,p,d,u[e+2],9,4243563512),d=r(d,v,h,p,u[e+7],14,1735328473),p=r(p,d,v,h,u[e+12],20,2368359562),h=i(h,p,d,v,u[e+5],4,4294588738),v=i(v,h,p,d,u[e+8],11,2272392833),d=i(d,v,h,p,u[e+11],16,1839030562),p=i(p,d,v,h,u[e+14],23,4259657740),h=i(h,p,d,v,u[e+1],4,2763975236),v=i(v,h,p,d,u[e+4],11,1272893353),d=i(d,v,h,p,u[e+7],16,4139469664),p=i(p,d,v,h,u[e+10],23,3200236656),h=i(h,p,d,v,u[e+13],4,681279174),v=i(v,h,p,d,u[e+0],11,3936430074),d=i(d,v,h,p,u[e+3],16,3572445317),p=i(p,d,v,h,u[e+6],23,76029189),h=i(h,p,d,v,u[e+9],4,3654602809),v=i(v,h,p,d,u[e+12],11,3873151461),d=i(d,v,h,p,u[e+15],16,530742520),p=i(p,d,v,h,u[e+2],23,3299628645),h=s(h,p,d,v,u[e+0],6,4096336452),v=s(v,h,p,d,u[e+7],10,1126891415),d=s(d,v,h,p,u[e+14],15,2878612391),p=s(p,d,v,h,u[e+5],21,4237533241),h=s(h,p,d,v,u[e+12],6,1700485571),v=s(v,h,p,d,u[e+3],10,2399980690),d=s(d,v,h,p,u[e+10],15,4293915773),p=s(p,d,v,h,u[e+1],21,2240044497),h=s(h,p,d,v,u[e+8],6,1873313359),v=s(v,h,p,d,u[e+15],10,4264355552),d=s(d,v,h,p,u[e+6],15,2734768916),p=s(p,d,v,h,u[e+13],21,1309151649),h=s(h,p,d,v,u[e+4],6,4149444226),v=s(v,h,p,d,u[e+11],10,3174756917),d=s(d,v,h,p,u[e+2],15,718787259),p=s(p,d,v,h,u[e+9],21,3951481745),h=t(h,a),p=t(p,f),d=t(d,l),v=t(v,c);return(o(h)+o(p)+o(d)+o(v)).toLowerCase()}function hslToRgb(e,t,n){var r,i,s,o,u,a;if(!isFinite(e))e=0;if(!isFinite(t))t=0;if(!isFinite(n))n=0;e/=60;if(e<0)e=6- -e%6;e%=6;t=Math.max(0,Math.min(1,t/100));n=Math.max(0,Math.min(1,n/100));u=(1-Math.abs(2*n-1))*t;a=u*(1-Math.abs(e%2-1));if(e<1){r=u;i=a;s=0}else if(e<2){r=a;i=u;s=0}else if(e<3){r=0;i=u;s=a}else if(e<4){r=0;i=a;s=u}else if(e<5){r=a;i=0;s=u}else{r=u;i=0;s=a}o=n-u/2;r=Math.round((r+o)*255);i=Math.round((i+o)*255);s=Math.round((s+o)*255);return{r:r,g:i,b:s}}function rgbToHex(e,t,n){return toHex(e)+toHex(t)+toHex(n)}function toHex(e){if(e==null)return"00";e=parseInt(e);if(e==0||isNaN(e))return"00";e=Math.max(0,e);e=Math.min(e,255);e=Math.round(e);return"0123456789ABCDEF".charAt((e-e%16)/16)+"0123456789ABCDEF".charAt(e%16)}function hashColor(e){if(colorCache[e])return colorCache[e];var t=MD5(e);var n=parseInt(t.substr(4,4),16)%360;var r=parseInt(t.substr(0,4),16)%50+50;var i=parseInt(t.substr(8,4),16)%20+25;var s,o,u;var a,f,l;r/=100;i/=100;if(r==0)a=f=l=(i*255).toString(16);else{if(i<=.5)o=i*(r+1);else o=i+r-i*r;s=i*2-o;u=n/360;a=HueToRgb(s,o,u+1/3);f=HueToRgb(s,o,u);l=HueToRgb(s,o,u-1/3)}colorCache[e]="#"+a+f+l;return colorCache[e]}function HueToRgb(e,t,n){var r;if(n<0)n+=1;else if(n>1)n-=1;if(6*n<1)r=e+(t-e)*n*6;else if(2*n<1)r=t;else if(3*n<2)r=e+(t-e)*(2/3-n)*6;else r=e;return(255*r).toString(16)}var colorCache={};hashColor=function(e){if(colorCache[e])return colorCache[e];var t=MD5(e);var n=parseInt(t.substr(4,4),16)%360;var r=parseInt(t.substr(0,4),16)%50+50;var i=parseInt(t.substr(8,4),16)%20+25;var s=hslToRgb(n,r,i);colorCache[e]="#"+rgbToHex(s.r,s.g,s.b);return colorCache[e]};var colorCache={}
