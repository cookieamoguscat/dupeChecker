Game.Win("Third-party");
if (DupeChecker === undefined) var DupeChecker = {};
if (typeof CCSE == "undefined")
	Game.LoadMod(
		"https://klattmose.github.io/CookieClicker/" +
			(0 ? "Beta/" : "") +
			"CCSE.js",
	);
DupeChecker.name = "DupeChecker";

DupeChecker.begin = () => {
	DupeChecker.defaultPrefs = {
		checkF: false,
		checkDH: false,
		checkBS: true,
		checkEV: false,
		default: true,
	};
	DupeChecker.prefs = DupeChecker.defaultPrefs;

	DupeChecker.load = (str) => {
		DupeChecker.prefs = CCSE.config.OtherMods.DupeChecker.prefs;
		DupeChecker.updateBtnsAndStates();
	};

	CCSE.customSave.push(function () {
		if (CCSE.config.OtherMods.DupeChecker === undefined) {
			CCSE.config.OtherMods.DupeChecker = {};
		}

		CCSE.config.OtherMods.DupeChecker.prefs = DupeChecker.prefs;
	});
	CCSE.customLoad.push(function () {
		if (CCSE.config.OtherMods.DupeChecker) {
			DupeChecker.prefs = CCSE.config.OtherMods.DupeChecker.prefs;
		} else {
			DupeChecker.prefs = DupeChecker.defaultPrefs;
		}
		DupeChecker.updateBtnsAndStates();
	});

	if (DupeChecker.prefs === "0") {
		console.error("Some save load/code error");
	}
	DupeChecker.updateBtnsAndStates = function () {
		DupeChecker.bsDupeBtn = DupeChecker.prefs.checkBS ? "" : "off";
		DupeChecker.fDupeBtn = DupeChecker.prefs.checkF ? "" : "off";
		DupeChecker.dhDupeBtn = DupeChecker.prefs.checkDH ? "" : "off";
		DupeChecker.evDupeBtn = DupeChecker.prefs.checkEV ? "" : "off";
	};
	DupeChecker.onBtnClick = (btnElement) => {
		const btnId = btnElement.id;
		PlaySound("snd/tick.mp3");
		if (btnId === "bsDupeBtn") {
			DupeChecker.prefs.checkBS = !DupeChecker.prefs.checkBS;
			DupeChecker.bsDupeBtn = DupeChecker.prefs.checkBS ? "" : "off";
		} else if (btnId === "fDupeBtn") {
			DupeChecker.prefs.checkF = !DupeChecker.prefs.checkF;
			DupeChecker.fDupeBtn = DupeChecker.prefs.checkF ? "" : "off";
		} else if (btnId === "dhDupeBtn") {
			DupeChecker.prefs.checkDH = !DupeChecker.prefs.checkDH;
			DupeChecker.dhDupeBtn = DupeChecker.prefs.checkDH ? "" : "off";
		} else if (btnId === "evDupeBtn") {
			DupeChecker.prefs.checkEV = !DupeChecker.prefs.checkEV;
			DupeChecker.evDupeBtn = DupeChecker.prefs.checkEV ? "" : "off";
		}
		Game.UpdateMenu();
	};

	DupeChecker.bsDupeBtn = "";
	DupeChecker.fDupeBtn = "off";
	DupeChecker.dhDupeBtn = "off";

	DupeChecker.evDupeBtn = "off";

	DupeChecker.customOptionsMenu = () => {
		let menuStr = "";
		menuStr += `<div class="title">Dupe checker</div>					<div class="listing"><a id="evDupeBtn" class="smallFancyButton prefButton ${DupeChecker.evDupeBtn} option" onclick="DupeChecker.onBtnClick(this)">${DupeChecker.prefs.checkEV ? "yes" : "no"}</a><label>Check for EVERY gc dupe</label></div>

					<div class="listing"><a id="bsDupeBtn" class="smallFancyButton prefButton ${DupeChecker.bsDupeBtn} option" onclick="DupeChecker.onBtnClick(this)">${DupeChecker.prefs.checkBS ? "yes" : "no"}</a><label>Check for Building Special Dupes</label></div>
					<div class="listing"><a id="fDupeBtn" class="smallFancyButton prefButton ${DupeChecker.fDupeBtn} option" onclick="DupeChecker.onBtnClick(this)">${DupeChecker.prefs.checkF ? "yes" : "no"}</a><label>Check for Frenzy dupes</label></div>
					<div class="listing"><a id="dhDupeBtn" class="smallFancyButton prefButton ${DupeChecker.dhDupeBtn} option" onclick="DupeChecker.onBtnClick(this)">${DupeChecker.prefs.checkDH ? "yes" : "no"}</a><label>Check for Dragon Harvest Dupes</label></div>
`;
		CCSE.AppendOptionsMenu(menuStr);
	};

	Game.customOptionsMenu.push(DupeChecker.customOptionsMenu);

	Game.gainBuff = function (type, time, arg1, arg2, arg3) {
		type = Game.buffTypesByName[type];
		var obj = type.func(time, arg1, arg2, arg3);
		obj.type = type;
		obj.arg1 = arg1;
		obj.arg2 = arg2;
		obj.arg3 = arg3;
		if (!obj.dname && obj.name != "???") obj.dname = loc(obj.name);

		var buff = {
			visible: true,
			time: 0,
			name: "???",
			desc: "",
			icon: [0, 0],
		};
		if (
			Game.buffs[obj.name]
		) //if there is already a buff in effect with this name
		{
			if (DupeChecker.prefs.checkEV) {
				PlaySound("snd/spellFail.mp3");
				Game.Notify("Dupe", `<b>Got a ${obj.name} dupe</b>`, [
					4,
					5,
					"https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png",
				]);
			} else if (
				obj.type.name === "building buff" &&
				DupeChecker.prefs.checkBS
			) {
				PlaySound("snd/spellFail.mp3");
				Game.Notify(
					"Building Special Dupe",
					`<b>Got a ${obj.name} dupe</b>`,
					[
						4,
						5,
						"https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png",
					],
				);
			} else if (
				obj.type.name === "dragon harvest" &&
				DupeChecker.prefs.checkDH
			) {
				PlaySound("snd/spellFail.mp3");
				Game.Notify(
					"Dragon Harvest Dupe",
					`<b>Got a ${obj.name} dupe</b>`,
					[
						4,
						5,
						"https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png",
					],
				);
			} else if (obj.type.name === "frenzy" && DupeChecker.prefs.checkF) {
				PlaySound("snd/spellFail.mp3");
				Game.Notify("Frenzy Dupe", `<b>Got a ${obj.name} dupe</b>`, [
					4,
					5,
					"https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png",
				]);
			} else {
				console.log("dupe?");
			}

			var buff = Game.buffs[obj.name];
			if (obj.max) buff.time = Math.max(obj.time, buff.time); //new duration is max of old and new
			if (obj.add) buff.time += obj.time; //new duration is old + new
			if (!obj.max && !obj.add) buff.time = obj.time; //new duration is set to new
			buff.maxTime = buff.time;
		} else //create new buff
		{
			for (var i in obj) //paste parameters onto buff
			{
				buff[i] = obj[i];
			}
			buff.maxTime = buff.time;
			Game.buffs[buff.name] = buff;
			buff.id = Game.buffsI;

			//create dom
			Game.buffsL.innerHTML =
				Game.buffsL.innerHTML +
				'<div id="buff' +
				buff.id +
				'" class="crate enabled buff" ' +
				(buff.desc
					? Game.getTooltip(
							'<div class="prompt" style="min-width:200px;text-align:center;font-size:11px;margin:8px 0px;" id="tooltipBuff"><h3>' +
								buff.dname +
								'</h3><div class="line"></div>' +
								buff.desc +
								"</div>",
							"left",
							true,
						)
					: "") +
				' style="opacity:1;float:none;display:block;' +
				writeIcon(buff.icon) +
				'"></div>';

			buff.l = l("buff" + buff.id);

			Game.buffsI++;
		}
		Game.recalculateGains = 1;
		Game.storeToRefresh = 1;
		return buff;
	};

	DupeChecker.isLoaded = 1;
};

if (!DupeChecker.isLoaded) {
	if (CCSE && CCSE.isLoaded) {
		DupeChecker.begin();
	} else {
		if (!CCSE) var CCSE = {};
		if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(DupeChecker.begin);
	}
}
