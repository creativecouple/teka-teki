/*
 *  Copyright (C) 2015 Bernhard Seckinger
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of version 3 of the GNU General Public License as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

teka.translate = function(index,param)
{
    if (param===undefined) {
        param = [];
    }
    
    var str = '???';
    
    if (teka.dictionary) {
        str = teka.dictionary[index];
    }
    
    for (var i=1;i<=param.length;i++) {
        str = str.replace('{'+i+'}',param[i-1]);
    }
    
    return str;
};

teka.dictionary = {
    blau: 'blau',
    blau_a: 'blauen',
    braun: 'braun',
    braun_a: 'braunen',
    change_color: 'Färbt alle Felder mit {1} Symbolen {2} ein.',
    check: 'Testen',
    check_descr: 'Überprüft, ob die Lösung richtig ist.',
    coloring: 'färben',
    color_of_pen: 'Stiftfarbe: {1}',
    congratulations: 'Herzlichen Glückwunsch!!!',
    delete_color: 'Löscht alle Felder mit {1} Symbolen.',
    deleting: 'löschen',
    grün: 'grün',
    grün_a: 'grünen',
    instructions: 'Anleitung',
    instructions_descr: 'Zeigt die Aufgabenstellung und eine Anleitung zur Bedienung dieses Applets an.',
    level: 'Stufe: {1}',
    load_state: 'Kehrt zum zuvor gespeicherten Zustand zurück.',
    save_state: 'Speichert den aktuellen Zustand.',
    schwarz: 'schwarz',
    schwarz_a: 'schwarzen',
    set_color: 'Setzt die Stiftfarbe auf {1}.',
    undo: 'Rückgängig',
    undo_descr: 'Macht alles bis inklusive der letzten größeren Änderung (=färben, löschen) rückgängig. Nochmaliges Drücken macht das letzte Rückgängingmachen wieder rückgängig.',
    
    kropki: 'Kropki',
    kropki_instructions: 'Tragen Sie die angegebenen Zahlen so in das Diagramm ein, '
        +'dass jede Zahl in jeder Zeile und jeder Spalte genau einmal vorkommt.\n\n'
        +'Befindet sich zwischen zwei Feldern ein schwarzer Kreis, '
        +'so muss eine der beiden Zahlen in diesen Feldern genau das Doppelte '
        +'der anderen sein.\n\n'
        +'Ein weißer Kreis hingegen bedeutet, dass eine der beiden Zahlen '
        +'in diesen Feldern genau um eins größer sein muss als die andere.\n\n'
        +'Befindet sich kein Kreis zwischen zwei Feldern, so darf keine '
        +'der beiden Eigenschaften zutreffen.',
    kropki_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Ist bereits die letzte Ziffer erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    kropki_unique_symbol: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    kropki_empty: 'Das markierte Feld ist leer.',
    kropki_row_duplicate: 'Die markierten Zahlen kommen in der Zeile doppelt vor.',
    kropki_column_duplicate: 'Die markierten Zahlen kommen in der Spalte doppelt vor.',
    kropki_twice: 'Die eine der beiden markierten Zahlen ist das Doppelte der anderen.',
    kropki_neighbours: 'Die Zahlen in den beiden markierten Feldern sind benachbart.',
    kropki_no_neighbours: 'Die beiden markierten Felder enthalten keine benachbarten Zahlen.',
    kropki_not_twice: 'Keines der beiden markierten Felder enthält das Doppelte des anderen.',
    kropki_digits: 'Ziffern von 1 bis {1}.',
    
    dummy_to_avoid_comma_bug: ''
};

