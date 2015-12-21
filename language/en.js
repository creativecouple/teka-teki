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

//General

teka.dictionary.too_small= 'The applet window is too small!';


//Pre-start window
teka.dictionary.init= 'Initialise';
teka.dictionary.start= 'Start';
teka.dictionary.properties= 'Properties';
teka.dictionary.no_properties= 'No specific properties';
teka.dictionary.solving_on_time= 'Solve the puzzle against the clock';
teka.dictionary.start_text= 'The time you require to solve this puzzle will be recorded!\n The clock will start running after you have clicked the "Start" button.'
        +'The clock will be stopped after you have clicked the "Submit solution" button AND your solution is correct.\n'
        +'The puzzle type can be inferred from the header line, and you can read information on the rules of the puzzle using the "Instructions" button before you start. '
        +'More detailed information on the handling can be obtained by clicking the "Puzzle controls" button, which will lead you to the description of input options.\n'
        +'Occasionally, you will find further comments on the puzzle in the bottom right corner (e.g. the dimension of the puzzle or the range of numbers and letters). ';

teka.dictionary.generic_size='Puzzle dimensions: {1}';


//Puzzle window
teka.dictionary.check = 'Submit solution';
teka.dictionary.check_descr = 'Submits (and checks) the current solution.';
teka.dictionary.undo = 'Undo';
teka.dictionary.undo_descr = 'Reverts the last major change (e.g. change of colours) - this action can be reverted by clicking again.';
teka.dictionary.instructions = 'Instructions';
teka.dictionary.instructions_descr = 'Displays the puzzle description together with instructions for the usage of the applet.';

teka.dictionary.black = 'black';
teka.dictionary.black_a = 'black';
teka.dictionary.blue = 'blue';
teka.dictionary.blue_a = 'blue';
teka.dictionary.brown = 'brown';
teka.dictionary.brown_a = 'brown';
teka.dictionary.orange = 'orange';
teka.dictionary.orange_a = 'orange';
teka.dictionary.pink = 'pink';
teka.dictionary.pink_a = 'pink';
teka.dictionary.green = 'green';
teka.dictionary.green_a = 'green';
teka.dictionary.turkey = 'turquoise';
teka.dictionary.turkey_a = 'turquoise';

teka.dictionary.color_of_pen = 'Marker colour: {1}';
teka.dictionary.coloring = 'Dye';
teka.dictionary.change_color = 'Changes the colour of all {1} entries into {2}.';

teka.dictionary.set_color = 'Sets the marker colour to "{1}".';

teka.dictionary.delete_color = 'Removes all {1} coloured entries.';
teka.dictionary.deleting = 'Delete';

teka.dictionary.level = 'Case level: {1}';
teka.dictionary.save_state = 'Stores the current state of the solution and initiates a new nested case level.';
teka.dictionary.load_state = 'Returns to the previously stored state of the solution for the given case nesting level.';

teka.dictionary.error = 'Unfortunately, an unexpected error has occurred!';
teka.dictionary.congratulations = 'Congratulations !!!';
teka.dictionary.failed_attempt= 'You had one failed attempt';
teka.dictionary.failed_attempts= 'You had {1} failed attempts';
teka.dictionary.duration_seconds= 'Your time was {1} seconds';
teka.dictionary.duration_minutes= 'Your time was {1} minutes and {2} seconds';
teka.dictionary.duration_hours= 'Your time was {1} hour, {2} minutes, and {3} seconds';
teka.dictionary.duration_days= 'Your time was {1} day(s), {2} hours, {3} minutes, and {4} seconds';

teka.dictionary.timeout= 'Your time has run out!';



//Instructions
teka.dictionary.next = 'Continue';
teka.dictionary.continuation = '...continued';
teka.dictionary.back = 'Back';

teka.dictionary.back_to_puzzle = 'Back to the puzzle';
teka.dictionary.instructions_global = '\nGeneral input - MOUSE:\n'
    +'\tOnly left mouse button clicks are activated. Hovering over the applet activates the cells, the currently active cell is highlighted.\n\n'
   +'General input - KEYBOARD: \n'
    +'\tArrow keys: select active cell\n\n'
    +'Button "Submit solution" (Ctrl+Enter):\n When you click this button the applet will check the current solution. '
    +'For a correct solution, the puzzle diagram cells will flash in various colours. '
    +'Otherwise, a single wrong entry will be highlighted in red, and a short explanation will be displayed. '
    +'\n\n'
    +'Button "Undo" (F3):\n Revert the last major change (e.g. change of colours). Note that the "Undo" action itself can be reverted as well by simply clicking the button a second time. '
    +'\n\n'
    +'Button "Instructions" (F4):\n Display the puzzle description together with instructions for the usage of the applet.\n\n'
    +'Button "Marker colour" (F5/F6/F7/F8):\n Choose between four different marker colours. Entries in different marker colours cannot be overwritten. '
    +'\n\n'
    +'Button "Change colour" (Shift + F5/F6/F7/F8):\n Change all entries of the currently active marker colour into a chosen colour. '
    +'\n\n'
    +'Button "Delete" (Ctrl + F5/F6/F7/F8):\n Remove all entries in the respective colour '
    +'\n\n'
    +'Cases (PgUp/PgDn):\n Click the "plus" (+) symbol in order to start a new nested case level. '
    +'You can then try out new entries and simply revert back to the former state by clicking the "minus" (-) symbol. Altogether, nine nested levels of cases are available.\n\n\n'
    +'Solve the puzzle against the clock:\n\nIf you have activated the "Solve Surprise Puzzles Against The Clock" mode in your personal preferences, the time you'
    +' require to solve this puzzle will be recorded. '
    +'You will first see a start screen when you initiate the applet. That screen contains relevant information on the puzzle, which you should read carefully before you start. Your time recording for the puzzle will '
    +'only be started after you activate the puzzle in the start screen!';


teka.dictionary.problem = 'Puzzle rules';
teka.dictionary.usage = 'Puzzle controls';
teka.dictionary.usage_applet = 'Applet controls';

// -------------------------------------
// -------------------------------------
// ------ PUZZLE SPECIFIC ENTRIES ------
// -------------------------------------

//ABCD
teka.dictionary.abcd= 'ABCD';
teka.dictionary.abcd_instructions = 'Fill each cell with one of the letters from the range given'
        +' below the diagram.\nNo two vertically or horizontally'
        +' adjacent cells can contain the same letter.'
        +' The numbers indicate how many letters occur in each column and row respectively. ';

teka.dictionary.abcd_usage = 'MOUSE INPUT\n\n'
        +'The first click sets an "A", each consecutive click leads to the next letter. '
        +'After the last letter the cell entry is removed and you can start over.\n'
        +'The given clues can be marked (cross marker) by clicking on the respective field. '
        +'The mark can be removed by clicking again.'
        +'\n\n'
        +'A click on the lower right corner of a field activates the "expert" mode for this field. '
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +' A second click on the lower right corner deactivates the expert mode. '
        +'\n\n'
        +'KEYBOARD INPUT\n\n'
        +'a,b,c,d: set the respective letter\n'
        +'Space: remove entry\n'
        +'# and ,: toggle "expert mode"\n'
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +'\n\n'
        +'#, *, q: set a marker in the clues on the top and left (cross marker)\nSpace: remove clue marker';
teka.dictionary.abcd_letters = 'Letters from A to {1}';
teka.dictionary.abcd_not_unique = 'The highlighted cell does not contain a unique entry';
teka.dictionary.abcd_empty = 'The highlighted cell is empty';
teka.dictionary.abcd_same_letters = 'The highlighted cells are adjacent and contain identical letters';
teka.dictionary.abcd_wrong_letters_row = 'The number of highlighted letters does not match the given clue in this row ';
teka.dictionary.abcd_wrong_letters_column = 'The number of highlighted letters does not match the given clue in this column ';

//ABCD nondiagonal

teka.dictionary.abcd_diagonal = 'ABCD';
    teka.dictionary.abcd_diagonal_instructions = 'Fill each cell with one of the letters from the range given'
        +' below the diagram.\nNo two '
        +' adjacent cells can contain the same letter (not even diagonally). '
        +' The numbers indicate how many letters occur in each column and row respectively. ';
teka.dictionary.abcd_diagonal_usage = 'MOUSE INPUT\n\n'
        +'The first click sets an "A", each consecutive click leads to the next letter. '
        +'After the last letter the cell entry is removed and you can start over.\n'
        +'The given clues can be marked (cross marker) by clicking on the respective field. '
        +'The mark can be removed by clicking again.'
        +'\n\n'
        +'A click on the lower right corner of a field activates the "expert" mode for this field. '
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +' A second click on the lower right corner deactivates the expert mode. '
        +'\n\n'
        +'KEYBOARD INPUT\n\n'
        +'a,b,c,d: set the respective letter\n'
        +'Space: remove entry\n'
        +'# and ,: toggle "expert mode"\n'
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +'\n\n'
        +'#, *, q: set a marker in the clues on the top and left (cross marker)\Space: remove clue marker';

//easy as ABC
teka.dictionary.easy_as_abc = 'Easy as ABC';
teka.dictionary.easy_as_abc_instructions = 'Fill some of the diagram cells using the letters from the range '
        +' given below the diagram.\n'
        +'Each letter must occur exactly once per column and row respectively. The letters outside the diagram'
        +' indicate, which letter comes first in the respective row or column as seen from the position of the'
        +' clue.';
teka.dictionary.easy_as_abc_usage = 'MOUSE INPUT\n\n'
        +'The first click sets an "A", each consecutive click leads to the next letter. '
        +'After the last letter the cell is marked as empty (dash marker), and the next click marks the cell as a '
        +' letter (circle marker). One more click will remove the entry '
        +'and you can start over.'
        +'\n\n'
        +'A click on the lower right corner of a field activates the "expert" mode for this field. '
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +' A second click on the lower right corner deactivates the expert mode. '
        +'\n\n'
        +'KEYBOARD INPUT\n\n'
        +'letter keys: set the respective letter\n'
        +'. , o: mark a letter cell (circle marker)\n'
        +'Minus (-): mark an empty cell (dash marker)\n'
        +'Space: remove entry\n'
        +'# and ,: toggle "expert mode"\n'
        +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
        +'\n\n';
teka.dictionary.easy_as_abc_letters = 'Letters from von A to {1}';
teka.dictionary.easy_as_abc_not_unique = 'The highlighted cell does not vontain a unique entry';
teka.dictionary.easy_as_abc_column_duplicate = 'The highlighted letters occur more than once in this column';
teka.dictionary.easy_as_abc_column_missing = 'The letter {1} is missing in this column';
teka.dictionary.easy_as_abc_row_duplicate = 'The highlighted letters occur more than once in this row';
teka.dictionary.easy_as_abc_row_missing = 'The letter {1} is missing in this row';
teka.dictionary.easy_as_abc_left_wrong = 'The highlighted letter does not coincide with the clue given at the left edge';
teka.dictionary.easy_as_abc_right_wrong = 'The highlighted letter does not coincide with the clue given at the right edge';
teka.dictionary.easy_as_abc_top_wrong = 'The highlighted letter does not coincide with the clue given at the upper edge';
teka.dictionary.easy_as_abc_bottom_wrong = 'The highlighted letter does not coincide with the clue given at the lower edge';

//Hashi

teka.dictionary.hashi = 'Hashi';
teka.dictionary.hashi_instructions = 'Connect all islands with each other using single and double bridges horizontally or vertically.\n '
    +'Bridges cannot cross other bridges or islands. A direct connection between a pair of two islands can only consist of a maximum of two bridges. '
    +'The numbers indicate how many bridges in total end on the respective island.'
    +'\n\n'
    +'Islands can be marked as "completed", but only the bridges are relevant for a correct solution.';
teka.dictionary.hashi_usage = 'MOUSE INPUT\n\n'
    +'Bridges\n'
    +'\tFirst click: set a horizontal bridge; Second click: set a second, parallel horizontal bridge\n'
    +'\tThird click: set a vertical bridge; Fourth click: set a second, parallel vertical bridge\n'
    +'\tFifth click: remove the current entry\n\t(Impossible bridge constructions, e.g. without endpoint, are'
    +' silently skipped)\n\n'
    +'Islands\n'
    +'\tFirst click: mark the island\n\tSecond click: remove the marker\n\n'
    +'KEYBOARD INPUT\n\n'
    +'Bridges\n'
    +'\tw: set a single horizontal bridge; Shift+w, e: set two horizontal bridges (double bridge)\n'
    +'\ts: set a single vertical bridge; Shift+s, d: set two vertical bridges (double bridge)\n'
    +'\tIf the respective bridge is already in place, a click on the key adds a second bridge or \n\t'
    +'removes the existing one(s).\n\n'
    +'Islands:\n'
    +'\t#, *, q: set marker\n\tSpace: remove marker';
teka.dictionary.hashi_prop_size = 'Puzzle dimensions: {1}';
teka.dictionary.hashi_wrong_bridges = 'The number of bridges ending at the highlighted island does not match the given number';
teka.dictionary.hashi_not_connected = 'The highlighted islands are not connected with each other';


//Heyawake

teka.dictionary.heyawake = 'Heyawake';
teka.dictionary.heyawake_instructions = 'Colour some of the diagram cells in black.\nNo two black cells '
    +'can be adjacent (horizontally or vertically), and all white cells are connected with each other (A sequence of connected black cells must not '
    +'divide the area of white cells). '
    +' No vertical or horizontal sequence of white cells can span more than 2 areas, defined by the bold lines.'
    +' The numbers indicate how many black cells are contained within the respective area. '
    +'Number cells can be black.\n\n'
    +'Cells can be marked as white, but only the black cells are required for a correct solution.';
teka.dictionary.heyawake_usage = 'MOUSE INPUT\n\n'
    +'\tFirst click: set black cell\n\tSecond click: set white cell (cross marker)\n\tThird click: remove entry\n\n'
    +'KEYBOARD INPUT\n\n'
    +'\t#, *, q: set black cell\n\t-, /, w: set white cell (cross marker)\n\tSpace: remove entry';
teka.dictionary.heyawake_neighbours = 'The highlighted black cells are adjacent';
teka.dictionary.heyawake_number_wrong = 'The number of black cells in the hihghlieghted area is incorrect';
teka.dictionary.heyawake_sequence_too_long = 'The adjacent highlighted white cells span more than two areas';
teka.dictionary.heyawake_not_connected = 'The highlighted white cells are not connected with the remaining white cells';


//Hitori

teka.dictionary.hitori = 'Hitori';
teka.dictionary.hitori_instructions = 'Colour some of the diagram cells in black.\nEach number in the remaining (white) cells '
    +'cannot occur more than once in each row or column respectively. '
    +'No two black cells can be horizontally or vertically adjacent, and all white cells must be connected with each other horizontally or vertically '
    +'(diagonally conected black cells cannot divide the area of white cells). '
    +'\n\n'
    +'Cells can be marked white, but only black cells are required for a correct solution.';
teka.dictionary.hitori_usage = 'MOUSE INPUT\n\n'
    +'\tFirst click: set black cell\n\tSecond click: set white cell (circle marker)\n\tThird click: remove entry\n\n'
    +'KEYBOARD INPUT\n\n'
    +'\t#, *, q: set black cell\n\t-, /, w: set white cell (circle marker)\n\tSpace: remove entry';
teka.dictionary.hitori_neighbours = 'The highlighted black cells are adjacent';
teka.dictionary.hitori_same_numbers = 'The highlighted cells contain the same number';
teka.dictionary.hitori_not_connected = 'The highlighted cells ar not connected with the remaining white cells';



//Jap. Summen

teka.dictionary.japanese_sums = 'Japanese Sums';
teka.dictionary.japanese_sums_instructions = 'Colour some of the diagram cells in black and use digits from the numerical range 1-N (given below the diagram) to fill  '
    +'the remaining cells.\nNo digit can occur more than once in any row or column. '
    +'The rows and columns of the diagram then contain blocks of numbers, separated by black cells. '
    +'The numbers outside the diagram show the sums of these blocks of digits in the correct order. '
    +'Single digit blocks have to be taken into account as well. \nA question mark indicates the existence of '
    +'a block with unknown sum. It is possible that no information is given in any row or column, the respective '
    + 'entries have to be inferred from logical deduction alone. '
    +'\n\n'
    +'All digits AND all black cells have to be correctly determined and filled in for a correct solution.';
teka.dictionary.japanese_sums_usage = 'MOUSE INPUT\n\n'
    +'\tFirst click: mark a number cell (circle marker)\n'
    +'\tSecond click: mark a black cell\n'
    +'\tThe follow-up clicks will change the numerical entry of the field consecutively from 1 to N.\n\t'
    +'After "N" the next click will remove the entry.'
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n'
    +'KEYBOARD INPUT\n\n'
    +'\tNum keys 1-9: set the respective digit\n'
    +'\t., o: mark a number cell (circle marker)\n'
    +'\tx, b, s: mark black cell\n'
    +'\tSpace: remove entry\n'
    +'\tMinus (-): mark a sequence of possible numbers\n'
    +'\t# or , : toggle "expert mode"\n'
    +'\t(In the expert mode you can show all possible entries at once and hide/unhide these entries individually)';
teka.dictionary.japanese_sums_prop_size = 'Puzzle dimensions: {1}';
teka.dictionary.japanese_sums_digits = 'Numbers from von 1 to {1}';

teka.dictionary.japanese_sums_empty = 'The highlighted cell is empty';
teka.dictionary.japanese_sums_not_unique = 'The highlighted cell does not contain a unique entry';
teka.dictionary.japanese_sums_row_duplicate = 'The highlighted numbers occur more than once in the same row';
teka.dictionary.japanese_sums_column_duplicate = 'The highlighted numbers occur more than once in the same column';
teka.dictionary.japanese_sums_row_count = 'The given number of sums does not coincide with the number of number blocks for the highlighted row';
teka.dictionary.japanese_sums_column_count = 'The given number of sums does not coincide with the number of number blocks for the highlighted column';
teka.dictionary.japanese_sums_sum_wrong = 'The sum of the highlighted numbers does not coincide with the given sum';

//Kakuro

teka.dictionary.kakuro = 'Kakuro';
teka.dictionary.kakuro_instructions = 'Fill this puzzle like a classical crossword, but use numbers 1-9 instead of letters.\n'
    +'The description of '
    +' a \'word\' is the sum of digits contained in this \'word\'.'
    +' No number can repeat itself within any \'word\'.';
teka.dictionary.kakuro_usage = 'MOUSE INPUT\n\n'
    +'The first click sets the lowest numer ("1") for the cell. Each consecutive click increases the number by one ("+1"). After you reached  '
    +'the highest number ("9"), the next click removes the entry.'
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n'
    +'KEYBOARD INPUT\n\n'
    +'\tNum keys 1-9: set the respective digit\n'
    +'\tSpace: remove entry\n'
    +'\tMinus (-): mark a sequence of possible numbers\n'
    +'\t# or , : toggle "expert mode"\n'
    +'\t(In the expert mode you can show all possible entries at once and hide/unhide these entries individually)';
teka.dictionary.kakuro_not_unique = 'The highlighted cell does not contain a unique entry';
teka.dictionary.kakuro_duplicate = 'The highlighted numbers are repeated within the \'word\'';
teka.dictionary.kakuro_wrong_sum = 'The sum is incorrect for the highlighted \'word\'';



//Kropki

teka.dictionary.kropki =  'Kropki';


teka.dictionary.kropki_instructions =  'Fill the diagram using only the numbers given below the diagram.\n'
    +'The same number cannot occur more than once in any row or column.\n\n'
    +'A black circle between two fields indicates that the number in one of the two fields must be exactly double the number in the other field. '
    +'\n\n'
    +'A white circle between two fields indicates that the numbers in the fields must be numerically adjacent. '
    +'\n\n'
    +'If no circle symbol is found between two fields, neither of the above numerical relations may be satisfied by the respective entries. '
    +'';
teka.dictionary.kropki_usage = 'MOUSE INPUT \n\n'
    + '\tFirst click: set the entry to "1". \n\tEach consecutive button click will increase the numerical value by one ("+1").\n'
    +'\After the highest possible number is reached the next click will remove the entry and you can start over. '
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n'
   +'KEYBOARD INPUT \n\n'
    +'\tNum keys: set the respective digit\n'
    +'\tSpace: remove entry\n'
    +'\t# and ;: toggle "expert mode"\n '
    +'\t(In the expert mode you can hide/unhide numbers individually using the num keys) '
    +'\n'
    +'Note: The expert mode can only be used if the Kropki contains nine or fewer numbers.';
teka.dictionary.kropki_unique_symbol =  'The highlighted field does not contain a unique entry';
teka.dictionary.kropki_empty =  'The highlighted field is empty';
teka.dictionary.kropki_row_duplicate =  'The highlighted numbers occur more than once in the row';
teka.dictionary.kropki_column_duplicate =  'The highlighted numbers occur more than once in the column';
teka.dictionary.kropki_twice =  'The ratio of the two highlighted numbers is exactly 2';
teka.dictionary.kropki_neighbours =  'The two highlighted numbers are numerically adjacent';
teka.dictionary.kropki_no_neighbours =  'The two highlighted numbers are not numerically adjacent';
teka.dictionary.kropki_not_twice =  'The ratio of the two highlighted numbers is not exactly 2';
teka.dictionary.kropki_digits =  'Numbers from 1 to {1}';

//Magnetplatten

teka.dictionary.magnets= 'Magnetic Blocks';
teka.dictionary.magnets_instructions= 'Fill the diagram with magnetic and neutral (black) blocks respectively.\n'
        +'A magnetic block consists of two poles ("+" and "-"). Two poles with identical polarisation cannot touch each other horizontally or vertically. '
        +'The numbers outside of the diagram indicate how many "+" and "-" poles in total are contained within the respective row or column.';
teka.dictionary.magnets_usage = 'MOUSE INPUT\n\n'
        +'\tFirst click: set a "+" pole\n\tSecond click: set a "-" pole \n\tThird click: set a neutral black block\n'
        +'\tFourth click: mark a magnetic block (undetermined polarisation)\n\tFifth click: remove entry\n\n'
        +'KEYBOARD INPUT\n\n'
        +'\t+, q: set "+" pole\n\t-, w: set "-" pole\n\tn,a,/: set neutral black block\n\t., #,s, *: '
        +'mark a magnetic block with undetermined polarisation \n\t'
        +'Space: remove entry\n\n'
        +'Magnetic blocks with undetermined polarisation are converted into a unique polarisation as soon as they touch a defined "+" or "-" pole. ';
teka.dictionary.magnets_prop_size = 'Puzzle dimensions: {1}';

teka.dictionary.magnets_empty = 'The highlighted block is empty.';
teka.dictionary.magnets_unique_symbol = 'The highlighted block contains an undetermined polarisation';
teka.dictionary.magnets_equal_poles = 'Two identical poles touch each other at the highlighted region';
teka.dictionary.magnets_row_plus = 'The number of "+" poles is incorrect for the highlighted row';
teka.dictionary.magnets_row_minus = 'The number of "-" poles is incorrect for the highlighted row';
teka.dictionary.magnets_column_plus = 'The number of "+" poles is incorrect for the highlighted column';
teka.dictionary.magnets_column_minus = 'The number of "-" poles is incorrect for the highlighted column';


//Masyu
teka.dictionary.masyu = 'Masyu';
teka.dictionary.masyu_instructions = 'Draw one closed, non-intersecting path that runs vertically and horizontally through some cells of the diagram.\n'
    +'The path must pass all black and white circles. The path goes straight through white circles and must make a 90° turn in at least one of the adjacent cells along the path.'
    +' The path makes a 90° turn in all black cells, after which it must continue straight through at least one more cell along the path in both directions respectively.';
teka.dictionary.masyu_usage = 'MOUSE INPUT\n\n'
    +'\tPress the left mouse button, keep it pressed, and pull the mouse to an adjacent cell in order to draw a path segment between two adjacent cells. '
    +'Repeat this process to generate a marker that indicates that this segment cannot exist (cross marker beween cells). '
    +'Finally, another repetition removes the segment entry completely.\n\n'
    +'\tKEYBOARD INPUT\n\n'
    +'\tPress and hold the SHIFT key, and move the cursor using the arrow keys for drawing a path segment between two adjacent cells. '
    +'Repeat this process to generate a marker that indicates that this segment cannot exist (cross marker beween cells). '
    +'Finally, another repetition removes the segment entry completely.';
teka.dictionary.masyu_deadend = 'The highlighted cell contains an open end of the path';
teka.dictionary.masyu_junction = 'Three ends meet in the highlighted cell';
teka.dictionary.masyu_crossing = 'Two path segments cross in th ehighlighted cell';
teka.dictionary.masyu_circle_missing = 'The path does not contain the highlighted circle';
teka.dictionary.masyu_white_circle = 'The path cannot have a turn in the highlighted field, but it must turn in at least one of the adjacent cells';
teka.dictionary.masyu_black_circle = 'The path must turn in the highlighted field, but it must not turn in either of the adjacent cells along the path';
teka.dictionary.masyu_not_connected = 'The highlighted path segments are not connected with the remaining path';
teka.dictionary.masyu_no_line_found = 'The diagram does not contain any path segments';


//Starbattle

teka.dictionary.starbattle = 'Starbattle';
teka.dictionary.starbattle_instructions = 'Place stars at some cells of the diagram.\n'
    +'Use as many stars as indicated below the puzzle for each row, column,, and area respectively. '
    +'Areas are defined by bold lines. '
    +'One star occupies exactly one cell of the diagram. The stars cannot touch each other, not even diagonally. ';
teka.dictionary.starbattle_usage = 'MOUSE INPUT\n\n'
    +'\tFirst click: set a star\n\tSecond click: mark empty field (dash marker)\n'
    +'\tThird click: remove entry\n\n'
    +'\tKEYBOARD INPUT\n\n'
    +'\t#, * , q: set a star\n\t-, /, w: mark empty field (dash marker)\n'
    +'\tSpace: remove entry';
teka.dictionary.starbattle_prop_size = 'Puzzle dimensions: {1}';
teka.dictionary.starbattle_stars = '{1} star(s) per row/column/area';

teka.dictionary.starbattle_touch = 'The highlighted stars touch each other';
teka.dictionary.starbattle_row = 'The number of stars is incorrect for the highlighted row';
teka.dictionary.starbattle_column = 'The number of stars is incorrect for the highlighted column';
teka.dictionary.starbattle_area = 'The number of stars is incorrect for the highlighted area';


//Sudoku
teka.dictionary.sudoku = 'Sudoku';
teka.dictionary.sudoku_instructions = 'Fill all diagram cells using digits from the numerical'
    +' range 1-N (given below the diagram).\n '
    +'The same number cannot occur more than once per row, column, and area respectively.\n\n';
teka.dictionary.sudoku_usage = 'MOUSE INPUT \n\n'
   + '\tFirst click: set the entry to "1". \n\tEach consecutive button click will increase the numerical value by one ("+1").\n'
    +'\After the highest possible number is reached the next click will remove the entry and you can start over. '
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n'
    +'KEYBOARD INPUT \n\n'
    +'\tNum keys: set the respective number\n'
    +'\tSpace: remove entry\n'
    +'\t# or , : toggle "expert mode"\n '
    +'\t(In the expert mode you can hide/unhide numbers individually using the num keys) ';
teka.dictionary.sudoku_digits = 'Numbers from von 1 to {1}';
teka.dictionary.sudoku_not_unique = 'The highlighted cell does not contain a unique entry';
teka.dictionary.sudoku_empty = 'The highlighted cell is empty';
teka.dictionary.sudoku_row_duplicate = 'The highlighted numbers occur more than once in the row';
teka.dictionary.sudoku_column_duplicate = 'The highlighted numbers occur more than once in the column';
teka.dictionary.sudoku_area_duplicate = 'The highlighted numbers occur more than once in the area';


// Tapa

teka.dictionary.tapa = 'Tapa';
teka.dictionary.tapa_instructions = 'Colour some of the diagram cells in black.\n All black cells have to be '
    +'horizontally or vertically connected with each other and no black 2x2-blocks can occur anywhere in the diagram. '
    +'Number cells cannot be black. '
    +'\n\n'
    +'The number cells: \n\t'
    +'Reading the entries circularly you obtain a sequence of numbers. The numbers identify the '
    +'lengths of blocks of consecutive black cells within the eight neighbouring cells (incl. diagonally)'
    +' seen circularly around the number cell. Each such block of '
    +'black cells belongs to exactly one number. The eight neighbouring cells '
    +'contain a sequence of these black blocks, interrupted by at least one white cell.'
    +' However, the order of these blocks is NOT determined by the order of the numbers.\n\n'
    +'Cells can be marked as white, but only black cells are relevant for a correct solution.';
teka.dictionary.tapa_usage = 'MOUSE INPUT\n\n'
    +'\tFirst click: set black cell\n\tSecond click: mark white cell (cross marker)\n\tThird click: remove entry\n\n'
    +'\tNumber cells can be marked/unmarked by a click '
    +'\n\n'
    +'KEYBOARD INPUT\n\n'
    +'\t#, *, q: mark black cell\n\t-, /, w: mark white cell (cross marker)\n\tSpace: remove entry\n\n'
    +'\t#, *, q: mark number cell \n\tSpace: remove mark';
teka.dictionary.tapa_prop_size = 'Diagram size {1}';
teka.dictionary.tapa_2x2 = 'The four highlighted cells mark a black 2x2 block';
teka.dictionary.tapa_wrong_numbers = 'The length/amount of black blocks around the highlighted number'
    +' cell does not match up with the given number(s)';
teka.dictionary.tapa_not_connected = 'The highlighted cells are not connected with the other black cells';



