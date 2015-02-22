/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent;

var lut = {
"Backquote": { "plain": {"plain": "`", "shifted": "ᜈ᜔ᜌ"}, "alternate": {"plain": "", "shifted":""}, "code": "Backquote"},
"Digit1": { "plain": {"plain": "1", "shifted": "!"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "2", "shifted": "@"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "3", "shifted": "#"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "4", "shifted": "₱"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "5", "shifted": "%"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "6", "shifted": "^"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "7", "shifted": "&"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "8", "shifted": "*"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "9", "shifted": "("}, "alternate": {"plain": "", "shifted":""}, "code": "Digit9"},
"Digit0": { "plain": {"plain": "0", "shifted": ")"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit0"},
"Minus": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},
"Equal": { "plain": {"plain": "᜔", "shifted": "+"}, "alternate": {"plain": "", "shifted":""}, "code": "Equal"},
"KeyQ": { "plain": {"plain": "ᜃᜓᜏ", "shifted": "ᜃ᜔ᜏ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "ᜏ", "shifted": "ᜏ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "ᜒ", "shifted": "ᜁ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "ᜍ", "shifted": "ᜍ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "ᜆ", "shifted": "ᜆ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "ᜌ", "shifted": "ᜌ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "ᜓ", "shifted": "ᜂ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "ᜒ", "shifted": "ᜁ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "ᜓ", "shifted": "ᜂ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "ᜉ", "shifted": "ᜉ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "[", "shifted": "{"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "]", "shifted": "}"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketRight"},
"KeyA": { "plain": {"plain": "", "shifted": "ᜀ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "ᜐ", "shifted": "ᜐ᜔ᜌ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "ᜇ", "shifted": "ᜇ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "ᜉ", "shifted": "ᜉ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "ᜄ", "shifted": "ᜄ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "ᜑ", "shifted": "ᜑ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "ᜇᜒᜌ", "shifted": "ᜇ᜔ᜌ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "ᜃ", "shifted": "ᜃ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "ᜎ", "shifted": "ᜎ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": ";", "shifted": ":"}, "alternate": {"plain": "", "shifted":""}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "’", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
"KeyZ": { "plain": {"plain": "ᜐ", "shifted": "ᜐ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "ᜃ᜔ᜐ", "shifted": "ᜃ᜔ᜐ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "ᜃ", "shifted": "ᜆ᜔ᜐ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "ᜊ", "shifted": "ᜊ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ᜊ", "shifted": "ᜊ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "ᜈ", "shifted": "ᜅ"}, "alternate": {"plain": "–", "shifted":""}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "ᜋ", "shifted": "ᜋ"}, "alternate": {"plain": "—", "shifted":""}, "code": "KeyM"},
"Comma": { "plain": {"plain": "᜵", "shifted": "<"}, "alternate": {"plain": "", "shifted":""}, "code": "Comma"},
"Period": { "plain": {"plain": "᜶", "shifted": ">"}, "alternate": {"plain": "", "shifted":""}, "code": "Period"},
"Slash": { "plain": {"plain": "᜴", "shifted": "?"}, "alternate": {"plain": "", "shifted":""}, "code": "Slash"},
};
    

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ?
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent !== undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents !== undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});
