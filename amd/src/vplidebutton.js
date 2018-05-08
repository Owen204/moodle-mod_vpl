// This file is part of VPL for Moodle - http://vpl.dis.ulpgc.es/
//
// VPL for Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// VPL for Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with VPL for Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * IDE Buttons
 * @package mod_vpl
 * @copyright 2016 Juan Carlos Rodríguez-del-Pino
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author Juan Carlos Rodríguez-del-Pino <jcrodriguez@dis.ulpgc.es>
 */

define(['jquery',
         'jqueryui',
         'mod_vpl/vplutil',
         ],
         function($, jqui, VPLUtil ) {
    if ( typeof VPLIDEButtons !== 'undefined' ) {
        return VPLIDEButtons;
    }
        var VPLIDEButtons = function(menuElement, isOptionAllowed) {
            var self = this;
            var buttons = {};

            this.notAdded = function(button) {
                return !buttons[button];
            };
            this.setText = function(button, icon, title) {
                if (self.notAdded(button)) {
                    return;
                }
                if (!icon) {
                    icon = buttons[button].icon;
                }
                if (!title) {
                    title = buttons[button].title;
                }
                if (!title) {
                    title = VPLUtil.str(icon);
                }
                buttons[button].icon = icon;
                buttons[button].title = title;
                if (buttons[button].hasOwnProperty('key')) {
                    title += ' (' + buttons[button].key + ')';
                }
                $('#vpl_ide_' + button).attr('title', title);
                $('#vpl_ide_' + button + ' i').replaceWith(VPLUtil.genIcon(icon));
            };
            this.setExtracontent = function(button, html) {
                if (self.notAdded(button)) {
                    return;
                }
                var cl = 'bt_extrahtml';
                var btag = $('#vpl_ide_' + button + ' i');
                if (btag.find('.' + cl).length == 0) {
                    btag.append(' <span class="' + cl + '"><span>');
                }
                btag.find('.' + cl).html(html);
            };
            this.add = function(button) {
                if (typeof button === 'string') {
                    var name = button;
                    button = {
                        'name' : name
                    };
                }
                if (!isOptionAllowed(button.name)) {
                    return;
                }
                if (!button.hasOwnProperty('icon')) {
                    button.icon = button.name;
                }
                if (!button.hasOwnProperty('active')) {
                    button.active = true;
                }
                if (!button.hasOwnProperty('editorName')) {
                    button.editorName = button.name;
                }
                if (!button.hasOwnProperty('originalAction')) {
                    button.originalAction = VPLUtil.doNothing;
                }
                if (self.notAdded(button)) {
                    buttons[button.name] = button;
                } else {
                    throw "Button already set " + button.name;
                }
                self.setAction(button.name, button.originalAction);
                if (button.hasOwnProperty('bindKey')) {
                    button.command = {
                        name : button.editorName,
                        bindKey : button.bindKey,
                        exec : button.action
                    };
                }
            };
            this.getHTML = function(button) {
                if (self.notAdded(button)) {
                    return '';
                } else {
                    var html = "<a id='vpl_ide_" + button + "' href='#' title='" + VPLUtil.str(button) + "'>";
                    html += VPLUtil.genIcon(button) + "</a>";
                    return html;
                }
            };

            this.enable = function(button, active) {
                if (self.notAdded(button)) {
                    return '';
                }
                var bw = $('#vpl_ide_' + button);
                buttons[button].active = active;
                bw.data("vpl-active", active);
                if ( ! active ) {
                    bw.addClass( 'ui-button-disabled ui-state-disabled' );
                } else {
                    bw.removeClass( 'ui-button-disabled ui-state-disabled' );
                }
            };
            this.setAction = function(button, action) {
                if (self.notAdded(button)) {
                    return;
                }
                buttons[button].originalAction = action;
                buttons[button].action = function() {
                    if (buttons[button].active) {
                        action();
                    }
                };
            };
            this.getAction = function(button) {
                if (self.notAdded(button)) {
                    return VPLUtil.doNothing;
                }
                return buttons[button].action;
            };
            this.launchAction = function(button) {
                if (self.notAdded(button)) {
                    return;
                }
                buttons[button].originalAction();
            };
            this.setGetkeys = function(editor) {
                if (editor) {
                    var commands = editor.commands.commands;
                    var platform = editor.commands.platform;
                    for (var button in buttons) {
                        if ( buttons.hasOwnProperty(button) ) {
                            var editorName = buttons[button].editorName;
                            if (commands[editorName] && commands[editorName].bindKey && !buttons[button].Key) {
                                buttons[button].key = commands[editorName].bindKey[platform];
                                self.setText(button);
                            } else {
                                if (buttons[button].bindKey) {
                                    if (!buttons[button].hasOwnProperty('key')) {
                                        buttons[button].key = buttons[button].bindKey[platform];
                                        self.setText(button);
                                    }
                                }
                            }
                        }
                    }
                }
            };
            this.getShortcuts = function(editor) {
                var html = '<ul>';
                for (var button in buttons) {
                    if (buttons[button].hasOwnProperty('key')) {
                        html += '<li>';
                        html += buttons[button].title + ' (' + buttons[button].key + ')';
                        html += '</li>';
                    }
                }
                html += '</ul>';
                if (editor) {
                    html += '<h5>' + VPLUtil.str('edit') + '</h5>';
                    var commands = editor.commands.commands;
                    var platform = editor.commands.platform;
                    html += '<ul>';
                    for (var editorName in commands) {
                        if (commands[editorName].hasOwnProperty('bindKey') && commands[editorName].bindKey[platform] > '') {
                            html += '<li>';
                            html += editorName + ' (' + commands[editorName].bindKey[platform] + ')';
                            html += '</li>';
                        }
                    }
                    html += '</ul>';
                }
                if ( html == '<ul></ul>') {
                    return '';
                }
                return html;
            };
            $(menuElement).on("click", "a", function(event) {
                if ( $(this).data("vpl-active") ) {
                    var actionid = $(this).attr('id');
                    if (typeof actionid === 'string' && actionid.startsWith('vpl_ide_')) {
                        actionid = actionid.replace('vpl_ide_', '');
                    } else {
                        return;
                    }
                    if (self.notAdded(actionid)) {
                        return;
                    }
                    if ( buttons[actionid] && ! buttons[actionid].active ) {
                        return;
                    }
                    var action = self.getAction(actionid);
                    if (actionid != 'import') {
                        setTimeout(action, 10);
                    } else {
                        action();
                    }
                }
                event.stopImmediatePropagation();
                return false;
            });

            $('body').on('keydown', function(event) {
                var check = false;
                var strkey = '';
                if (event.shiftKey) {
                    strkey += 'shift-';
                }
                if (event.altKey) {
                    strkey += 'alt-';
                    check = true;
                }
                if (event.ctrlKey) {
                    strkey += 'ctrl-';
                    check = true;
                }
                if (event.metaKey) {
                    strkey += 'meta-';
                    check = true;
                }
                if (event.which >= 112 && event.which <= 123) {
                    strkey += 'f' + (event.which - 111);
                    check = true;
                } else {
                    var char = String.fromCharCode(event.which).toLowerCase();
                    if (char < 'a' || char > 'z') {
                        check = false;
                    } else {
                        strkey += char;
                    }
                }
                if (check) {
                    for (var button in buttons) {
                        if (buttons[button].hasOwnProperty('key')) {
                            if (strkey == buttons[button].key.toLowerCase()) {
                                event.preventDefault();
                                event.stopImmediatePropagation();
                                buttons[button].action();
                                return false;
                            }
                        }
                    }
                }
            });
            this.multiple = function(v, m) {
                return v - (v % m);
            };
            (function() {
                var start = 0;
                var lastLap = 0;
                var interval = false;
                var hour = 60 * 60;
                var day = hour * 24;
                var cssclases = 'vpl_buttonleft_orange vpl_buttonleft_red vpl_buttonleft_black';
                var show = false;
                var element = null;
                var precision = 5;
                var checkt = 1000;
                var timeLeft = 0;
                var update = function() {
                    var now = self.multiple(VPLUtil.getCurrentTime(), precision);
                    if (now === lastLap || element === null) {
                        return;
                    }
                    lastLap = now;
                    var tl = timeLeft - (lastLap - start);
                    var cssclass = '';
                    if (tl <= 0) {
                        cssclass = 'vpl_buttonleft_black';
                    } else if (tl <= 5 * 60) {
                        show = true;
                        cssclass = 'vpl_buttonleft_red';
                    } else if (tl <= 15 * 60) {
                        cssclass = 'vpl_buttonleft_orange';
                    }
                    var thtml = VPLUtil.genIcon('timeleft');
                    if (show) {
                        thtml += ' ' + VPLUtil.getTimeLeft(tl);
                    }
                    element.html(thtml);
                    element.removeClass(cssclases).addClass(cssclass);
                };
                self.toggleTimeLeft = function() {
                    show = !show;
                    lastLap = false;
                    update();
                };
                self.setTimeLeft = function(options) {
                    element = $('#vpl_ide_timeleft span');
                    if (interval !== false) {
                        clearInterval(interval);
                        interval = false;
                    }
                    if (options.hasOwnProperty('timeLeft')) {
                        $('#vpl_ide_timeleft').show();
                        precision = 5;
                        checkt = 1000;
                        timeLeft = options.timeLeft;
                        if (timeLeft > hour) {
                            precision = 60;
                            checkt = 5000;
                        }
                        if (timeLeft > day) {
                            precision = 5 * 60;
                        }
                        var sync = timeLeft % precision;
                        timeLeft = self.multiple(timeLeft, precision);
                        start = self.multiple(VPLUtil.getCurrentTime(), precision);
                        lastLap = start - 1;
                        update();
                        setTimeout( function() {
                            interval = setInterval(update, checkt);
                        }, sync * 1000);
                    } else {
                        $('#vpl_ide_timeleft').hide();
                    }
                };
            })();
        };
        window.VPLIDEButtons = VPLIDEButtons;
        return VPLIDEButtons;
    }
);
