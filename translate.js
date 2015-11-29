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

/**
 * Takes a string (index) and optionally an array with parameters
 * and returns a translated version of that string with the parameters
 * in place of {1}, {2} and so on.
 *
 * The german version of the dictionary is located in this file. The values
 * can be overridden in an other file. Thus the german version akts as an
 * backup if the translation does not exist.
 */
teka.translate = function(index,param)
{
    if (param===undefined) {
        param = [];
    }

    var str = '???';

    if (teka.dictionary && teka.dictionary[index]!==undefined) {
        str = teka.dictionary[index];
    }

    for (var i=1;i<=param.length;i++) {
        str = str.replace('{'+i+'}',param[i-1]);
    }

    return str;
};

/**
 * The german dictionary.
 */
teka.dictionary = {
    back: 'Zurück',
    back_to_puzzle: 'Zurück zum Rätsel',
    black: 'schwarz',
    black_a: 'schwarzen',
    blue: 'blau',
    blue_a: 'blauen',
    brown: 'braun',
    brown_a: 'braunen',
    change_color: 'Färbt alle Felder mit {1} Symbolen {2} ein.',
    check: 'Testen',
    check_descr: 'Überprüft, ob die Lösung richtig ist.',
    coloring: 'färben',
    color_of_pen: 'Stiftfarbe: {1}',
    congratulations: 'Herzlichen Glückwunsch!!!',
    continuation: 'Fortsetzung',
    delete_color: 'Löscht alle Felder mit {1} Symbolen.',
    deleting: 'löschen',
    error: 'Leider ist ein unerwarteter Fehler aufgetreten.',
    green: 'grün',
    green_a: 'grünen',
    instructions: 'Anleitung',
    instructions_descr: 'Zeigt die Aufgabenstellung und eine Anleitung zur Bedienung dieses Applets an.',
    instructions_global: 'Testen (Strg-Enter): Wenn Sie auf diesen Button klicken, überprüft '
        +'das Applet, ob Ihre Lösung stimmt. Ist die Lösung richtig, so blinkt '
        +'das Rätsel in unterschiedlichen Blautönen. Ist die Lösung hingegen falsch, '
        +'so wird ein Fehler im Rätsel markiert und ein Fehlertext angezeigt.\n\n'
        +'Rückgängig (F3): Die letzte größere Änderung wird rückgängig gemacht. Sie '
        +'können auch das Rückgängigmachen selbst rückgängig machen, indem sie diesen '
        +'Button nochmal drücken.\n\n'
        +'Anleitung (F4): Zeigt eine Anleitung zum Rätsel, sowie zur Bedienung des '
        +'Applets an.\n\n'
        +'Farben wählen (F5 - F8): Ihnen stehen im Applet vier verschiedene Farben zur '
        +'Auswahl. Markierungen in einer Farbe können mit einer anderen Farbe nicht '
        +'überschrieben werden.\n\n'
        +'Färben (Shift-F5 - Shift-F8): Wenn Sie auf \'färben\' klicken, können sie '
        +'die Markierungen in der aktuellen Schriftfarbe umfärben.\n\n'
        +'Löschen (Strg-F5 - Strg-F8): Damit löschen Sie alle Markierungen der entsprechenden '
        +'Farbe.\n\n'
        +'Fallunterscheidungen (Bild-hoch und Bild-runter): Klicken Sie auf das '
        +'Plus-Symbol um eine neue Fallunterscheidung zu beginnen. Sie können dann '
        +'einen Fall ausprobieren und jederzeit wieder zu dem vorigen Zustand zurückkehren, '
        +'indem Sie auf das Minus-Symbol klicken. Die Fallunterscheidungen können '
        +'neunfach verschachtelt sein.\n\n\n'
        +'Rätsel auf Zeit lösen: Wenn Sie in Ihren Einstellungen angegeben haben, '
        +'dass Sie das Überraschungsrätsel auf Zeit lösen wollen, erhalten Sie beim '
        +'Start des Applets einen Startbildschirm mit drei Button. Was diese Button '
        +'genau bewirken, wird auf dem Startbildschirm erklärt.',
    level: 'Stufe: {1}',
    load_state: 'Kehrt zum zuvor gespeicherten Zustand zurück.',
    next: 'Weiter',
    orange: 'orange',
    orange_a: 'orangenen',
    pink: 'rosa',
    pink_a: 'rosafarbigen',
    problem: 'Aufgabe',
    save_state: 'Speichert den aktuellen Zustand.',
    set_color: 'Setzt die Stiftfarbe auf {1}.',
    turkey: 'türkis',
    turkey_a: 'türkisfarbigen',
    undo: 'Rückgängig',
    undo_descr: 'Macht alles bis inklusive der letzten größeren Änderung (=färben, löschen) rückgängig. Nochmaliges Drücken macht das letzte Rückgängingmachen wieder rückgängig.',
    usage: 'Bedienung',
    usage_applet: 'Allgemein',

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
        +'und ausschalten.\n\n\n'
        +'Hinweis: Der Expertenmodus kann nur genutzt werden, wenn das Kropki '
        +'maximal 9 Ziffern enthält.',
    kropki_unique_symbol: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    kropki_empty: 'Das markierte Feld ist leer.',
    kropki_row_duplicate: 'Die markierten Zahlen kommen in der Zeile doppelt vor.',
    kropki_column_duplicate: 'Die markierten Zahlen kommen in der Spalte doppelt vor.',
    kropki_twice: 'Die eine der beiden markierten Zahlen ist das Doppelte der anderen.',
    kropki_neighbours: 'Die Zahlen in den beiden markierten Feldern sind benachbart.',
    kropki_no_neighbours: 'Die beiden markierten Felder enthalten keine benachbarten Zahlen.',
    kropki_not_twice: 'Keines der beiden markierten Felder enthält das Doppelte des anderen.',
    kropki_digits: 'Ziffern von 1 bis {1}.',

    magnets: 'Magnetplatten',
    magnets_instructions: 'Füllen Sie das Diagramm mit magnetischen und neutralen '
        +'(=schwarzen) Platten. Jede Magnetplatte hat zwei Pole (+ und -). '
        +'Zwei Hälften mit gleichen Polen dürfen nicht waagerecht oder senkrecht '
        +'benachbart sein. Die Zahlen an den Rändern geben an, wie viele Plus- '
        +'und Minuspole in der entsprechenden Zeile oder Spalte vorkommen.',
    magnets_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Pluspol\n2. Klick: Minuspol\n3. Klick: Neutrale Platte\n'
        +'4. Klick: Plusminusplatte\n5. Klick: Feldinhalt löschen (weiß)\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'+/Q: Pluspol\n-/W: Minuspol\nN,A und /: Neutrale Platte\n. und #,S und *: '
        +'Plusminusplatte\n'
        +'Leertaste: Feldinhalt löschen\n\n'
        +'Plusminusplatten werden automatisch zu einer richtigen Magnetplatte, wenn sie '
        +'eine solche berühren.',
    magnets_empty: 'Die markierte Magnetplatte ist leer.',
    magnets_unique_symbol: 'Die markierte Magnetplatte ist noch nicht eindeutig.',
    magnets_equal_poles: 'An der markierten Stelle berühren sich zwei gleiche Pole.',
    magnets_row_plus: 'In der markierten Zeile stimmt die Anzahl der Pluspole nicht.',
    magnets_row_minus: 'In der markierten Zeile stimmt die Anzahl der Minuspole nicht.',
    magnets_column_plus: 'In der markierten Spalte stimmt die Anzahl der Pluspole nicht.',
    magnets_column_minus: 'In der markierten Spalte stimmt die Anzahl der Minuspole nicht.',

    dummy_to_avoid_comma_bug: ''
};
