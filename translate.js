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

teka.used = {};

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
    duration_seconds: 'Ihre Zeit war {1} Sekunden.',
    duration_minutes: 'Ihre Zeit war {1} Minuten und {2} Sekunden.',
    duration_hours: 'Ihre Zeit war {1} Stunden, {2} Minuten und {3} Sekunden.',
    duration_days: 'Ihre Zeit war {1} Tage, {2} Stunden, {3} Minuten und {4} Sekunden.',
    error: 'Leider ist ein unerwarteter Fehler aufgetreten.',
    failed_attempt: 'Sie hatten einen Fehlversuch.',
    failed_attempts: 'Sie hatten {1} Fehlversuche.',
    green: 'grün',
    green_a: 'grünen',
    init: 'Initialisieren',
    instructions: 'Anleitung',
    instructions_descr: 'Zeigt die Aufgabenstellung und eine Anleitung zur Bedienung dieses Applets an.',
    instructions_global: 'Testen (Strg-Enter): Wenn Sie auf diesen Button klicken, überprüft '
        +'das Applet, ob Ihre Lösung stimmt. Ist die Lösung richtig, so blinkt '
        +'das Rätsel. Ist die Lösung hingegen falsch, '
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
        +'Start des Applets einen Startbildschirm mit Buttons. Was diese Buttons '
        +'genau bewirken, wird auf dem Startbildschirm erklärt.',
    level: 'Stufe: {1}',
    load_state: 'Kehrt zum zuvor gespeicherten Zustand zurück.',
    next: 'Weiter',
    no_properties: 'Keine bekannten Eigenschaften',
    orange: 'orange',
    orange_a: 'orangenen',
    pink: 'rosa',
    pink_a: 'rosafarbigen',
    problem: 'Aufgabe',
    properties: 'Eigenschaften',
    save_state: 'Speichert den aktuellen Zustand.',
    set_color: 'Setzt die Stiftfarbe auf {1}.',
    solving_on_time: 'Rätsellösen auf Zeit',
    start: 'Starten',
    start_text: 'Bei diesem Rätsel wird die Zeit gestoppt, die Sie zum Lösen '
        +'benötigen. Die Zeitmessung beginnt in dem Moment, wo sie auf "Starten" '
        +'klicken, und endet, sobald sie erfolgreich auf "Testen" geklickt haben.\n'
        +'Bevor sie starten, haben sie die Möglichkeit ein paar Dinge im Voraus '
        +'über das Rätsel zu erfahren: Die Rätselart steht bereits oben auf dieser '
        +'Seite. Rechts unten sind möglicherweise weitere Eigenschaften des Rätsels, '
        +'wie beispielsweise dessen Größe, angegeben. Sie können auch auf '
        +'\"Anleitung\" klicken. Dort erfahren Sie die Regeln des Rätsels, sowie '
        +'die Bedienung des Applets bei diesem speziellen Rätsel.',
    timeout: 'Die Zeit für dieses Rätsel ist abgelaufen.',
    too_small: 'Das Fenster ist zu klein.',
    turkey: 'türkis',
    turkey_a: 'türkisfarbigen',
    undo: 'Rückgängig',
    undo_descr: 'Macht alles bis inklusive der letzten größeren Änderung (=färben, löschen) rückgängig. Nochmaliges Drücken macht das letzte Rückgängingmachen wieder rückgängig.',
    usage: 'Bedienung',
    usage_applet: 'Allgemein',

    generic_size: 'Größe {1}.',

    abcd: 'ABCD-Rätsel',
    abcd_instructions: 'Tragen Sie in jedes Feld einen der angegebenen Buchstaben so ein, '
        +'dass in waagerecht und senkrecht benachbarten Feldern keine '
        +'gleichen Buchstaben stehen. Die Zahlen am Rand geben an, wie oft jeder der '
        +'Buchstaben in der entsprechenden Zeile oder Spalte vorkommt. ',
    abcd_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt ein A in das Feld ein. Jeder weitere Klick '
        +'führt zum nächsten Buchstaben. Ist bereits der letzte Buchstabe erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jeden Buchstaben einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n'
        +'Ein Klick in den Vorgaben links und oben setzt ein Kreuz. Ein weiterer Klick löscht dieses wieder.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Buchstabentasten: Den entsprechenden Buchstaben in das Feld eintragen\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Buchstabentasten jeden Buchstaben einzeln ein- '
        +'und ausschalten.\n\n'
        +'Links und oben:\n#, * und Q: Markieren\nLeertaste: Feldinhalt löschen',
    abcd_letters: 'Buchstaben von A bis {1}.',
    abcd_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    abcd_empty: 'Das markierte Feld ist leer.',
    abcd_same_letters: 'In den markierten Feldern sind gleiche Buchstaben benachbart.',
    abcd_wrong_letters_row: 'Die Anzahl des markierten Buchstabens stimmt in der entsprechenden Zeile nicht.',
    abcd_wrong_letters_column: 'Die Anzahl des markierten Buchstabens stimmt in der entsprechenden Spalte nicht.',

    abcd_diagonal: 'ABCD-Rätsel ohne Diagonalberührung',
    abcd_diagonal_instructions: 'Tragen Sie in jedes Feld einen der angegebenen Buchstaben so ein, '
        +'dass in benachbarten Feldern keine gleichen Buchstaben stehen, '
        +'auch nicht diagonal. Die Zahlen am Rand geben an, wie oft jeder der '
        +'Buchstaben in der entsprechenden Zeile oder Spalte vorkommt. ',
    abcd_diagonal_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt ein A in das Feld ein. Jeder weitere Klick '
        +'führt zum nächsten Buchstaben. Ist bereits der letzte Buchstabe erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jeden Buchstaben einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n'
        +'Ein Klick in den Vorgaben links und oben setzt ein Kreuz. Ein weiterer Klick löscht dieses wieder.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Buchstabentasten: Den entsprechenden Buchstaben in das Feld eintragen\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Buchstabentasten jeden Buchstaben einzeln ein- '
        +'und ausschalten.\n\n'
        +'Links und oben:\n#, * und Q: Markieren\nLeertaste: Feldinhalt löschen',

    arukone: 'Arukone',
    arukone_instructions: 'Verbinden Sie jeweils gleiche Buchstaben durch einen Linienzug '
        +'der waagerecht und senkrecht von Feldmittelpunkt zu Feldmittelpunkt '
        +'verläuft, so dass jedes Feld maximal einmal durchlaufen wird.\n\n'
        +'Bitte beachten Sie: Es kann auch Felder geben, die von keinem '
        +'Buchstaben belegt sind.',
    arukone_usage: 'Bedienung mit der Maus:\n\n'
        +'Ziehen Sie bei gedrückter Maustaste von einem Feld zum Nachbarfeld, um eine Linie zu zeichnen. '
        +'Wiederholen Sie diesen Prozess, um zu markieren, dass die entsprechende Linie nicht vorhanden ist (markiert durch ein Kreuz) '
        +'und wiederholen Sie diesen Prozess erneut, um wieder alles zu löschen.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Bewegen Sie den Curser bei gedrückter SHIFT-Taste um eine Linie zu zeichnen. '
        +'Wiederholen Sie diesen Prozess um zu markieren, dass die entsprechende Linie nicht vorhanden ist (markiert durch ein Kreuz) '
        +'und wiederholen Sie diesen Prozess erneut, um wieder alles zu löschen.',
    arukone_letters: 'Buchstaben von A bis {1}.',
    arukone_deadend: 'Im markierten Feld befindet sich eine Sackgasse.',
    arukone_junction: 'Im markierten Feld stoßen drei Linien zusammen.',
    arukone_crossing: 'Im markierten Feld befindet sich eine Kreuzung.',
    arukone_letter_not_connected: 'Vom markierten Buchstaben geht keine Linie weg.',
    arukone_letter_connected_several_times: 'Vom markierten Buchstaben gehen mehrere Linien weg.',
    arukone_different_letters: 'Die markierte Linie verbindet unterschiedliche Buchstaben.',
    arukone_circle: 'Das markierte Feld enthält eine Linie, ist aber mit keinem Buchstaben verbunden.',

    basic: 'Basic',
    basic_instructions: 'Tragen Sie Zahlen so in das Diagramm ein, dass in jeder Zeile und '
        +'jeder Spalte jede der angegebenen '
        +'Zahlen genau einmal vorkommt. Die kleinen Zahlen in den Gebieten '
        +'geben das Ergebnis der Rechnung an, wenn man den nachfolgenden Operator '
        +'auf die Zahlen des Gebiets anwendet. Steht kein Operator nach der Zahl, '
        +'so ist dieser unbekannt, muss aber eine der vier Grundrechenarten sein!\n\n'
        +'Achtung: Innerhalb eines Gebiets können Zahlen doppelt vorkommen!',
    basic_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Ist bereits die letzte Ziffer erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die linke untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die linke untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'NONEtaste: Feldinhalt löschen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    basic_digits: 'Zahlen von 1 bis {1}.',
    basic_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    basic_empty: 'Das markierte Feld ist leer.',
    basic_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    basic_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    basic_wrong_result: 'Im markierten Bereich stimmt das Ergebnis der Rechnung nicht.',

    easy_as_abc: 'Buchstabensalat',
    easy_as_abc_instructions: 'Tragen Sie die unter dem Rätsel angegebenen Buchstaben so in das Diagramm ein,'
        +' dass in jeder Zeile und jeder Spalte jeder Buchstabe genau einmal vorkommt.'
        +' Die Buchstaben am Rand geben an, welcher Buchstabe in der entsprechenden'
        +' Zeile oder Spalte aus der entsprechenden Richtung gesehen als erstes steht.',
    easy_as_abc_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt ein A in das Feld ein. Jeder weitere Klick '
        +'führt zum nächsten Buchstaben. Ist bereits der letzte Buchstabe erreicht, '
        +'so wird durch einen erneuten Klick ein Strich eingetragen um anzuzeigen, '
        +'dass das Feld leer bleiben soll. Der nächste Klick zeichnet einen Kreis '
        +'in das Feld ein. Dieser bedeutet, dass es sich um ein Zahlenfeld handelt.'
        +'Durch einen weiteren Klick wird der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jeden Buchstaben einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Buchstabentasten: Den entsprechenden Buchstaben in das Feld eintragen\n'
        +'.: Als Buchstabenfeld markieren (wird als Kreis dargestellt)\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'Minustaste: Als Leerfeld markieren\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Buchstabentasten jeden Buchstaben einzeln ein- '
        +'und ausschalten.',
    easy_as_abc_letters: 'Buchstaben von A bis {1}.',
    easy_as_abc_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    easy_as_abc_column_duplicate: 'Die markierten Buchstaben kommen in der Spalte doppelt vor.',
    easy_as_abc_column_missing: 'In der markierten Spalte fehlt der Buchstabe {1}.',
    easy_as_abc_row_duplicate: 'Die markierten Buchstaben kommen in der Zeile doppelt vor.',
    easy_as_abc_row_missing: 'In der markierten Zeile fehlt der Buchstabe {1}.',
    easy_as_abc_left_wrong: 'Der markierte Buchstabe stimmt nicht mit dem Buchstaben am linken Rand überein.',
    easy_as_abc_right_wrong: 'Der markierte Buchstabe stimmt nicht mit dem Buchstaben am rechten Rand überein.',
    easy_as_abc_top_wrong: 'Der markierte Buchstabe stimmt nicht mit dem Buchstaben am oberen Rand überein.',
    easy_as_abc_bottom_wrong: 'Der markierte Buchstabe stimmt nicht mit dem Buchstaben am unteren Rand überein.',

    fences: 'Rundwegrätsel',
    fences_instructions: 'Zeichnen Sie entlang der gepunkteten Linien einen geschlossenen Weg ein, '
        +'wobei nicht alle Gitterpunkte durchlaufen werden müssen. Die Zahlen '
        +'in den Feldern geben an, wie viele der benachbarten Kanten für den Weg '
        +'verwendet werden. Der Weg darf sich nicht selbst kreuzen oder berühren.',
    fences_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Kante gesetzt\n2. Klick: Kante leer (markiert durch ein Kreuz)\n3. Klick: Feldinhalt löschen\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Kante gesetzt\n-, / und W: Kante leer (markiert durch ein Kreuz)\nLeertaste: Feldinhalt löschen\n'
        +'Escape: Wählt bei der Navigation mit den Cursortasten eine alternative Kante aus. '
        +'Alle Alternativen werden durch dünne rote Striche markiert.',
    fences_rectangular_size: 'Rechteckgitter der Größe {1}.',
    fences_with_holes: 'Mit Löchern.',
    fences_graph_size: 'Mit {1} Feldern.',
    fences_dead_end: 'Die markierte Kante endet in einer Sackgasse.',
    fences_branching: 'Die markierten Kanten treffen sich in einem Verzweigungspunkt.',
    fences_number_wrong: 'Bei der markierten Fläche stimmt die Anzahl der Kanten nicht.',
    fences_not_connected: 'Die markierten Kanten hängen nicht mit dem Rest zusammen.',

    fillomino: 'Fillomino',
    fillomino_instructions: 'Unterteilen Sie das Diagramm in Gebiete und schreiben Sie in jedes Feld'
        +' eine Zahl. Die Zahlen in einem Gebiet müssen alle gleich sein und die'
        +' Anzahl der Felder dieses Gebiets angeben. Gebiete gleicher Größe dürfen'
        +' sich dabei an den Kanten'
        +' nicht berühren, wohl aber über Eck.\n\n'
        +'Vorgegebene Zahlen können zum gleichen Gebiet gehören und es kann Gebiete'
        +' geben, von denen noch keine Zahl bekannt ist - auch mit größeren als den'
        +' vorgegebenen Zahlen.\n\n'
        +'Beim Prüfen werden nur die eingetragenen Zahlen beachtet. Kanten werden'
        +' dort nur benutzt, um die Zahlen in Leerfeldern zu bestimmen.',
    fillomino_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer, bis zur 99. Der nächste Klick löscht den Feldinhalt.\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'Leertaste: Feldinhalt löschen\n',
    fillomino_rectangular_size: 'Rechteckgitter der Größe {1}.',
    fillomino_graph_size: 'Mit {1} Feldern.',
    fillomino_empty: 'Das markierte Feld ist leer.',
    fillomino_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    fillomino_ambiguous: 'Die Zahlen im markierten Bereich können nicht eindeutig bestimmt werden.',
    fillomino_area_wrong_size: 'Die Größe des markierten Gebiets stimmt nicht oder es berühren sich hier Gebiete mit gleichen Zahlen.',
    fillomino_edge_between_same: 'Zwischen den beiden markierten Feldern mit gleicher Zahl befindet sich eine vorgegebene Kante.',

    greater_than_sudoku: 'Vergleichssudoku',
    greater_than_sudoku_instructions: 'Tragen Sie die angegebenen Zahlen so in das Diagramm ein, '
        +'dass in jeder Zeile, jeder Spalte und jedem fett umrandeten '
        +'Gebiet jede Zahl genau einmal vorkommt.\n\n'
        +'Die Kleinerzeichen zwischen zwei Feldern geben an, in '
        +'welchem der beiden Felder die kleinere Zahl steht.',
    greater_than_sudoku_usage: 'Bedienung mit der Maus:\n\n'
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
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    greater_than_sudoku_digits: 'Ziffern von 1 bis {1}.',
    greater_than_sudoku_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    greater_than_sudoku_empty: 'Das markierte Feld ist leer.',
    greater_than_sudoku_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    greater_than_sudoku_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    greater_than_sudoku_area_duplicate: 'Die markierten Ziffern kommen in dem Gebiet doppelt vor.',
    greater_than_sudoku_symbol_wrong: 'Der Vergleich zwischen den beiden markierten Feldern stimmt nicht.',

    hashi: 'Hashi',
    hashi_instructions: 'Verbinden Sie die Inseln so durch Brücken, dass jede Insel '
        +'von jeder anderen aus erreichbar ist. Die Brücken dürfen dabei '
        +'nur waagerecht oder senkrecht gebaut werden und nicht über andere '
        +'Brücken oder Inseln hinweggehen. Zwischen zwei Inseln dürfen sich '
        +'maximal zwei Brücken befinden. Die Zahlen in den Inseln geben an, '
        +'wie viele Brücken von dieser Insel aus wegführen. Ist in '
        +'einer Insel keine Zahl vorgegeben, so ist nicht bekannt, wie viele '
        +'Brücken von dieser Insel aus wegführen.\n\n'
        +'Für eine korrekte Lösung müssen nur die Brücken eingezeichnet werden.',
    hashi_usage: 'Bedienung mit der Maus:\n\n'
        +'Brücken:\n'
        +'1. Klick: Eine waagerechte Brücke; 2. Klick: Zwei waagerechte Brücken\n'
        +'3. Klick: Eine senkrechte Brücke; 4. Klick: Zwei senkrechte Brücken\n'
        +'5. Klick: Feldinhalt löschen\nBrücken, die nicht gebaut werden können '
        +'werden dabei übersprungen\n'
        +'Inseln:\n'
        +'1. Klick: Markieren\n2. Klick: Markierung löschen\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Brücken:\n'
        +'w: Eine waagerechte Brücke; Shift-W oder e: zwei waagerechte Brücken\n'
        +'s: Eine senkrechte Brücke; Shift-S oder d: zwei senkrechte Brücken\n'
        +'Ist bereits die entsprechende Brücke eingezeichnet wird eine zweite '
        +'Brücke dazu beziehungsweise eine weniger eingezeichnet.\n'
        +'Inseln:\n'
        +'#, * und Q: Markieren\nLeertaste: Feldinhalt löschen',
    hashi_wrong_bridges: 'In der markierten Insel stimmt die Anzahl der Brücken nicht.',
    hashi_not_connected: 'Die markierten Inseln hängen nicht mit dem Rest zusammen.',

    heyawake: 'Heyawake',
    heyawake_instructions: 'Schwärzen Sie einige Felder im Diagramm, sodass keine zwei schwarzen '
        +'Felder waagerecht oder senkrecht nebeneinander stehen und alle weißen '
        +'Felder zusammenhängen (das heißt: die schwarzen Felder dürfen das Rätsel '
        +'nicht in zwei Teile teilen). Zudem darf keine waagerechte oder senkrechte '
        +'Folge von weißen Feldern durch mehr als zwei Gebiete gehen. Die Zahlen '
        +'in den Feldern geben an, wie viele Schwarzfelder in diesem Gebiet zu '
        +'finden sind. Felder mit Zahlen dürfen geschwärzt werden.\n\n'
        +'Für eine korrekte Lösung werden nur die Schwarzfelder gewertet.',
    heyawake_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Schwarzes Feld\n2. Klick: Weißes Feld (markiert durch ein Kreuz)\n3. Klick: Feldinhalt löschen\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Schwarzes Feld\n-, / und W: Weißes Feld (markiert durch ein Kreuz)\nLeertaste: Feldinhalt löschen',
    heyawake_neighbours: 'Die markierten schwarzen Felder sind benachbart.',
    heyawake_number_wrong: 'Im markierten Gebiet stimmt die Anzahl der Schwarzfelder nicht.',
    heyawake_sequence_too_long: 'Die markierten Leerfelder gehen über mehr als 2 Gebiete.',
    heyawake_not_connected: 'Die markierten Felder sind nicht mit dem Rest der weißen Felder verbunden.',

    hitori: 'Hitori',
    hitori_instructions: 'Schwärzen Sie einige Felder im Diagramm so, dass in den '
        +'verbleibenden Feldern jede Zahl in jeder Zeile und jeder Spalte nur '
        +'maximal einmal vorkommt. Alle ungeschwärzten Felder müssen miteinander '
        +'verbunden sein (das heißt, die Schwarzfelder dürfen das Rätsel nicht '
        +'in zwei Teile teilen). Zudem dürfen keine zwei Schwarzfelder benachbart sein.\n\n'
        +'Für eine korrekte Lösung werden nur die Schwarzfelder gewertet.',
    hitori_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Schwarzes Feld\n2. Klick: Weißes Feld (markiert durch einen Kreis)\n3. Klick: Feldinhalt löschen\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Schwarzes Feld\n-, / und W: Weißes Feld (markiert durch einen Kreis)\nLeertaste: Feldinhalt löschen',
    hitori_neighbours: 'Die markierten schwarzen Felder sind benachbart.',
    hitori_same_numbers: 'In den markierten Feldern befindet sich die gleiche Zahl.',
    hitori_not_connected: 'Die markierten Felder sind nicht mit dem Rest der weißen Felder verbunden.',

    japanese_sums: 'Japanische Summen',
    japanese_sums_instructions: 'Schwärzen Sie einige Felder im Diagramm und tragen Sie in die '
        +'restlichen Felder die angegebenen Ziffern so ein, dass in keiner '
        +'Zeile oder Spalte eine Ziffer mehrfach vorkommt. Die Zahlen am '
        +'Rand geben in der richtigen Reihenfolge die Summen von Blöcken '
        +'aufeinanderfolgender Ziffern (ohne Schwarzfeld dazwischen) an. '
        +'Auch einzelne Ziffern werden hier angegeben. Ein Fragezeichen steht '
        +'für eine unbekannte Zahl. Steht am Rand nichts, so ist über die '
        +'entsprechenden Zeile oder Spalte nichts bekannt.\n\n'
        +'Für eine korrekte Lösung müssen zusätzlich zu allen Zahlen auch '
        +'alle Schwarzfelder eingezeichnet sein.',
    japanese_sums_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick zeichnet einen Kreis in das Feld ein. Dieser bedeutet, '
        +'dass es sich um ein Zahlenfeld handelt. Der nächste Klick trägt ein '
        +'Schwarzfeld ein. Danach folgen die Zahlen von 1 bis zur Maximalzahl '
        +'und mit dem nächsten Klick wird der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'. oder O: Als Zahlenfeld markieren (wird als Kreis dargestellt)\n'
        +'X, B oder S: Schwarzfeld\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    japanese_sums_digits: 'Zahlen von 1 bis {1}.',
    japanese_sums_empty: 'Das markierte Feld ist leer.',
    japanese_sums_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    japanese_sums_row_duplicate: 'Die markierten Zahlen kommen in der Zeile doppelt vor.',
    japanese_sums_column_duplicate: 'Die markierten Zahlen kommen in der Spalte doppelt vor.',
    japanese_sums_row_count: 'In der markierten Zeile stimmt die Anzahl der Summen nicht mit denen am Rand überein.',
    japanese_sums_column_count: 'In der markierten Spalte stimmt die Anzahl der Summen nicht mit denen am Rand überein.',
    japanese_sums_sum_wrong: 'Die markierten Zahlen ergeben nicht die entsprechende Summe am Rand.',

    kakuro: 'Kakuro',
    kakuro_instructions: 'Füllen Sie das Rätsel wie ein Kreuzworträtsel aus. Verwenden Sie'
        +' dabei an Stelle der Buchstaben die Ziffern von 1 bis 9. Die Beschreibung'
        +' eines \'Wortes\' gibt die Summe der Ziffern in diesem \'Wort\' an.'
        +' Innerhalb eines \'Wortes\' darf keine Ziffer doppelt vorkommen.',
    kakuro_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Klicken Sie nach der 9 erneut um '
        +'den Feldinhalt zu löschen.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    kakuro_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    kakuro_duplicate: 'Die markierten Ziffern kommen in der Zahl mehrfach vor.',
    kakuro_wrong_sum: 'Die Summe stimmt in der markierten Zahl nicht.',

    killer_sudoku: 'Killer-Sudoku',
    killer_sudoku_instructions: 'Tragen Sie Zahlen so in das Diagramm ein, dass in jeder Zeile, '
        +'jeder Spalte und jedem fett umrandeten Gebiet jede der angegebenen '
        +'Zahlen genau einmal vorkommt. Die kleinen Zahlen in den Gebieten '
        +'geben die Summe der Zahlen in diesem Gebiet an. Innerhalb eines '
        +'Gebiets kommt keine Zahl doppelt vor.',
    killer_sudoku_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Ist bereits die letzte Ziffer erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die linke untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die linke untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'Leertaste: Feldinhalt löschen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    killer_sudoku_digits: 'Zahlen von 1 bis {1}.',
    killer_sudoku_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    killer_sudoku_empty: 'Das markierte Feld ist leer.',
    killer_sudoku_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    killer_sudoku_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    killer_sudoku_area_duplicate: 'Die markierten Ziffern kommen in dem Gebiet doppelt vor.',
    killer_sudoku_sum_duplicate: 'Die markierten Zahlen kommen innerhalb einer Summe doppelt vor.',
    killer_sudoku_wrong_sum: 'Im markierten Bereich stimmt die Summe nicht.',

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

    masyu: 'Masyu',
    masyu_instructions: 'Zeichnen Sie in das Rätsel einen Rundweg ein, der durch jedes Feld mit einem'
        +' Kreis hindurchgeht und in den Feldern im 90°-Winkel abbiegen kann.'
        +' In Feldern mit einem schwarzen Kreis muss er dabei im 90°-Winkel'
        +' abbiegen und in beiden Richtungen im nächsten Feld geradeaus'
        +' hindurchgehen. Durch Felder mit einem weißen Kreis muss er geradeaus'
        +' hindurchgehen und in mindestens einem der beiden Nachbarfelder im'
        +' 90°-Winkel abbiegen.',
    masyu_usage: 'Bedienung mit der Maus:\n\n'
        +'Ziehen Sie bei gedrückter Maustaste von einem Feld zum Nachbarfeld, um eine Linie zu zeichnen. '
        +'Wiederholen Sie diesen Prozess, um zu markieren, dass die entsprechende Linie nicht vorhanden ist (markiert durch ein Kreuz) '
        +'und wiederholen Sie diesen Prozess erneut, um wieder alles zu löschen.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Bewegen Sie den Curser bei gedrückter SHIFT-Taste um eine Linie zu zeichnen. '
        +'Wiederholen Sie diesen Prozess um zu markieren, dass die entsprechende Linie nicht vorhanden ist (markiert durch ein Kreuz) '
        +'und wiederholen Sie diesen Prozess erneut, um wieder alles zu löschen.',
    masyu_deadend: 'Im markierten Feld befindet sich eine Sackgasse.',
    masyu_junction: 'Im markierten Feld stoßen drei Linien zusammen.',
    masyu_crossing: 'Im markierten Feld befindet sich eine Kreuzung.',
    masyu_circle_missing: 'Der Weg geht nicht durch das markierte Feld mit Kreis.',
    masyu_white_circle: 'Im markierten Feld darf der Weg nicht abbiegen, muss aber in einem der beiden Nachbarfelder abbiegen.',
    masyu_black_circle: 'Im markierten Feld muss der Weg abbiegen, und in beiden Richtungen danach geradeaus weiter gehen.',
    masyu_not_connected: 'Der markierte Rundweg hängt nicht mit dem Rest des Weges zusammen.',
    masyu_no_line_found: 'Im Diagramm befindet sich kein Wegstück.',

    skyscrapers: 'Hochhäuser',
    skyscrapers_instructions: 'Tragen Sie in jedes Feld ein Hochhaus der Höhe 1 bis n so ein,'
        +' dass in jeder Zeile und jeder Spalte jede mögliche Höhe genau'
        +' einmal vorkommt. Die Zahlen am Rand geben jeweils an, wie viele'
        +' Häuser in der entsprechenden Zeile oder Spalte aus der'
        +' entsprechenden Richtung gesehen werden können; niedrigere'
        +' Hochhäuser werden dabei von höheren verdeckt.',
    skyscrapers_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Ist bereits die letzte Ziffer erreicht, '
        +'so wird durch einen erneuten Klick der Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'EMPTYtaste: Feldinhalt löschen\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    skyscrapers_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    skyscrapers_empty: 'Das markierte Feld ist leer.',
    skyscrapers_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    skyscrapers_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    skyscrapers_top_wrong: 'In der markierten Spalte ist die Anzahl der von oben sichtbaren Hochhäuser falsch.',
    skyscrapers_bottom_wrong: 'In der markierten Spalte ist die Anzahl der von unten sichtbaren Hochhäuser falsch.',
    skyscrapers_left_wrong: 'In der markierten Zeile ist die Anzahl der von links sichtbaren Hochhäuser falsch.',
    skyscrapers_right_wrong: 'In der markierten Zeile ist die Anzahl der von rechts sichtbaren Hochhäuser falsch.',

    skyscrapers_with_parks: 'Hochhäuser mit Parks',
    skyscrapers_with_parks_instructions: 'Tragen Sie in jedes Feld ein Hochhaus der Höhe 1 bis n so ein,'
        +' dass in jeder Zeile und jeder Spalte jede mögliche Höhe genau'
        +' einmal vorkommt, sowie die angegebene Anzahl an Parks. Die'
        +' Zahlen am Rand geben jeweils an, wie viele Häuser in der'
        +' entsprechenden Zeile oder Spalte aus der entsprechende Richtung'
        +' gesehen werden können; niedrigere Hochhäuser werden dabei von'
        +' höheren verdeckt. Parks verdecken keine Hochhäuser.',
    skyscrapers_with_parks_usage: 'Bedienung mit der Maus:\n\n'
        +'Der erste Klick trägt eine 1 in das Feld ein. Jeder weitere Klick '
        +'führt zur nächsten Ziffer. Nach der letzten Ziffer führt ein weiterer '
        +'Klick zu einem Minuszeichen. Durch den nächsten Klick wird der '
        +'Feldinhalt gelöscht.\n\n'
        +'Ein Klick in die rechte untere Ecke des Feldes startet den Expertenmodus '
        +'für dieses Feld. Im Expertenmodus können Sie jede Ziffer einzeln ein- '
        +'und ausschalten. Ein erneuter Klick in die rechte untere Ecke beendet '
        +'den Expertenmodus.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'Zifferntasten: Die entsprechende Ziffer in das Feld eintragen\n'
        +'EMPTYtaste: Feldinhalt löschen\n'
        +'X, B oder S: EMPTYfeld markieren\n'
        +'Minustaste: Markierung von Zahlbereichen\n'
        +'# und ,: Zwischen dem Expertenmodus und dem Normalmodus hin- und herschalten. '
        +'Im Expertenmodus können Sie mit den Zifferntasten jede Ziffer einzeln ein- '
        +'und ausschalten.',
    skyscrapers_with_parks_park: '1 Park',
    skyscrapers_with_parks_parks: '{1} Parks',
    skyscrapers_with_parks_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    skyscrapers_with_parks_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    skyscrapers_with_parks_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    skyscrapers_with_parks_top_wrong: 'In der markierten Spalte ist die Anzahl der von oben sichtbaren Hochhäuser falsch.',
    skyscrapers_with_parks_bottom_wrong: 'In der markierten Spalte ist die Anzahl der von unten sichtbaren Hochhäuser falsch.',
    skyscrapers_with_parks_left_wrong: 'In der markierten Zeile ist die Anzahl der von links sichtbaren Hochhäuser falsch.',
    skyscrapers_with_parks_right_wrong: 'In der markierten Zeile ist die Anzahl der von rechts sichtbaren Hochhäuser falsch.',
    skyscrapers_with_parks_row_wrong_parks: 'In der markierten Zeile stimmt die Anzahl der Parks nicht.',
    skyscrapers_with_parks_column_wrong_parks: 'In der markierten Spalte stimmt die Anzahl der Parks nicht.',

    starbattle: 'Doppelstern',
    starbattle_instructions: 'Tragen Sie in das Diagramm Sterne so ein, dass sich '
        +'in jeder Zeile, jeder Spalte und jedem fettumrandeten Gebiet genau so '
        +'viele Sterne befinden wie unter dem Rätsel angegeben ist. '
        +'Die Sterne haben jeweils die Größe eines Kästchens und dürfen einander '
        +'nicht berühren, auch nicht diagonal.',
    starbattle_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Stern\n2. Klick: Leerfeld (markiert durch einen Strich)\n'
        +'3. Klick: Feldinhalt löschen\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Stern\n-, / und W: Leerfeld (markiert durch einen Strich)\n'
        +'Leertaste: Feldinhalt löschen',
    starbattle_stars: 'Anzahl der Sterne: {1}',
    starbattle_touch: 'Die beiden markierten Sterne berühren sich.',
    starbattle_row: 'In der markierten Zeile stimmt die Anzahl der Sterne nicht.',
    starbattle_column: 'In der markierten Spalte stimmt die Anzahl der Sterne nicht.',
    starbattle_area: 'Im markierten Gebiet stimmt die Anzahl der Sterne nicht.',

    starry_sky: 'Sternenhimmel',
    starry_sky_instructions: 'Zeichnen Sie in einige der leeren Felder einen Stern, '
        +'so dass sowohl auf jeden Stern mindestens ein Pfeil als auch '
        +'jeder Pfeil auf mindestens einen Stern zeigt. Die Pfeile können '
        +'hierbei durch andere Pfeile und Sterne hindurchzeigen. Die Zahlen '
        +'am Rand geben an, wie viele Sterne in der entsprechenden Zeile oder '
        +'Spalte zu finden sind.\n\n'
        +'Für eine korrekte Lösung sind nur die Felder mit einem Stern relevant.',
    starry_sky_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Stern\n2. Klick: Weißes Feld (markiert durch ein Minus)\n3. Klick: Feldinhalt löschen\n\n'
        +'In einem Feld mit einem vorgegebenen Pfeil führt der erste Klick zu einem '
        +'Kreuz und der zweite löscht dieses wieder.\n\n'
        +'Alternativ können Sie auch mit der Maus über mehrere Felder ziehen, '
        +'in all diesen Feldern wird dann ein Stern gesetzt (dragging).\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Stern\n-, / und W: Weißes Feld (markiert durch ein Minus)\nLeertaste: Feldinhalt löschen\n\n'
        +'In einem Feld mit einem vorgegebenen Pfeil führen #, * und Q zu einem Kreuz und die Leertaste '
        +'löscht dieses wieder.',
    starry_sky_row: 'In der markierten Zeile stimmt die Anzahl der Sterne nicht.',
    starry_sky_column: 'In der markierten Spalte stimmt die Anzahl der Sterne nicht.',
    starry_sky_zero_pointer: 'Der markierte Pfeil zeigt auf keinen Stern.',
    starry_sky_no_pointer: 'Auf den markierten Stern zeigt kein Pfeil.',

    sudoku: 'Sudoku',
    sudoku_instructions: 'Tragen Sie die angegebenen Ziffern so in das Diagramm ein, '
        +'dass in jeder Zeile, jeder Spalte und jedem fett umrandeten '
        +'Gebiet jede Ziffer genau einmal vorkommt.',
    sudoku_usage: 'Bedienung mit der Maus:\n\n'
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
    sudoku_digits: 'Ziffern von 1 bis {1}.',
    sudoku_not_unique: 'Das markierte Feld enthält kein eindeutiges Symbol.',
    sudoku_empty: 'Das markierte Feld ist leer.',
    sudoku_row_duplicate: 'Die markierten Ziffern kommen in der Zeile doppelt vor.',
    sudoku_column_duplicate: 'Die markierten Ziffern kommen in der Spalte doppelt vor.',
    sudoku_area_duplicate: 'Die markierten Ziffern kommen in dem Gebiet doppelt vor.',

    tapa: 'Tapa',
    tapa_instructions: 'Schwärzen Sie einige Felder im Diagramm so, dass alle schwarzen '
        +'Felder waagerecht oder senkrecht zusammenhängen und kein 2x2-Feld '
        +'komplett geschwärzt ist. Felder mit Zahlen dürfen dabei grundsätzlich '
        +'nicht geschwärzt werden.\n\n'
        +'Für die Felder, die Zahlen enthalten, gilt: '
        +'Betrachtet man die Nachbarfelder dieses Feldes einmal im Kreis herum, so '
        +'erhält man eine Folge von schwarzen und weißen Feldern. Die Zahlen geben '
        +'die Längen der Schwarzblöcke in dieser Sequenz wieder, wobei jede Zahl zu '
        +'genau einem Block gehört und die Reihenfolge nicht bekannt ist.\n\n'
        +'Für eine korrekte Lösung sind nur die schwarzen Felder relevant. '
        +'Die weißen Felder können mit einem Kreuz markiert oder leer sein.',
    tapa_usage: 'Bedienung mit der Maus:\n\n'
        +'1. Klick: Schwarzes Feld\n2. Klick: Weißes Feld (markiert durch ein Kreuz)\n3. Klick: Feldinhalt löschen\n\n'
        +'In einem Feld mit Vorgaben führt der erste Klick zu einem '
        +'Kreuz und der zweite löscht dieses wieder.\n\n\n'
        +'Bedienung mit der Tastatur:\n\n'
        +'#, * und Q: Schwarzes Feld\n-, / und W: Weißes Feld (markiert durch ein Kreuz)\nLeertaste: Feldinhalt löschen\n\n'
        +'In einem Feld mit Vorgaben führen #, * und Q zu einem Kreuz und die Leertaste '
        +'löscht dieses wieder.',
    tapa_2x2: 'Die vier markierten Felder bilden ein volles 2x2-Gebiet.',
    tapa_wrong_numbers: 'Im markierten Feld stimmen die Zahlen nicht.',
    tapa_not_connected: 'Die markierten Felder hängen nicht mit dem Rest der Schwarzfelder zusammen.',

    dummy_to_avoid_comma_bug: ''
};
