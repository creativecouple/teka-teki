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

teka.dictionary.next = 'Continue';
teka.dictionary.continuation = 'Continuation';



//Pre-start window
teka.dictionary.init= 'Initialise';
teka.dictionary.start= 'Start';
teka.dictionary.properties= 'Properties';
teka.dictionary.no_properties= 'No specific properties';
teka.dictionary.solving_on_time= 'Solve the puzzle against the clock';
teka.dictionary.start_text= 'For this puzzle the time you require to solve it will be recorded. The clock will start running after you have clicked the "Initialise" button AND the "Start" button.'
        +'The clock will be stopped after you have clicked the "Submit solution" button AND your solution is correct.\n'
        +'Before you start you have the opportunity to read information on the rules of the puzzle. '
        +'The puzzle type can be inferred from the header line. Occasionally, you will find further comments on the puzzle in the bottom right corner, '
        +'e.g. its the size. '
        +'More detailed information can be obtained by clicking the "Manual" button, which will lead you to the rules of the puzzle and the controls.';

//Puzzle window
teka.dictionary.check = 'Submit solution';
teka.dictionary.check_descr = 'Submits (and checks) the current solution.';
teka.dictionary.undo = 'Undo';
teka.dictionary.undo_descr = 'Reverts the last major change (e.g. change of colours) - this action can be reverted by clicking again.'
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

teka.dictionary.error = 'Unfortunately, an unexpected error has occurred.';
teka.dictionary.congratulations = 'Congratulations !!!';
teka.dictionary.failed_attempt= 'You had one failed attempt.',
teka.dictionary.failed_attempts= 'You had {1} failed attempts.',
teka.dictionary.duration_seconds= 'Your time was {1} seconds.',
teka.dictionary.duration_minutes= 'Your time was {1} minutes and {2} seconds.',
teka.dictionary.duration_hours= 'Your time was {1} hour, {2} minutes, and {3} seconds.',
teka.dictionary.duration_days= 'Your time was {1} day(s), {2} hours, {3} minutes, and {4} seconds.',


//Instructions
teka.dictionary.back = 'Back';
teka.dictionary.back_to_puzzle = 'Go back';
teka.dictionary.instructions_global = '"Submit solution" (Ctrl-Enter): When you click this button the applet will check the current solution. '
    +'For a correct solution, the puzzle will flash in various shades of blue.'
    +'Otherwise, a single wrong entry will be highlighted in red, and a short explanation will be displayed. '
    +'\n\n'
    +'"Undo" (F3): Reverts the last major change (e.g. change of colours). Note: the "undo" action itself can be reverted as well by simply clicking the button a second time. '
    +'\n\n'
    +'"Instructions" (F4): Displays the puzzle description together with instructions for the usage of the applet.\n\n'
    +'"Marker colour" (F5 - F8): Choose between four different marker colours. Entries in different marker colours cannot be overwritten. '
    +'\n\n'
    +'"Change colour" (Shift-F5 - Shift-F8): Changes all entries of the currently active marker colour into a chosen colour. '
    +'\n\n'
    +'"Delete" (Ctrl-F5 - Ctrl-F8): Removes all entries in the respective colour '
    +'\n\n'
    +'Cases (Pg Up/Dn): Click the "plus" symbol in order to start a new case '
    +'You can then try new entries and simply revert back to the former state by clicking the "minus" symbol. Altogether nine nested levels of cases are possible.\n\n\n'
    +'Solve the puzzle against the clock:\n If you have activated the "solve surprise puzzles against the clock" mode in your personal preferences, the time you'
    +' require to solve this puzzle will be recorded. '
    +'You will first see a start screen when you initiate the applet. That screen contains three buttons and relevant information. Your time recording for the puzzle will '
    +'only be started after you activate the puzzle in the start screen! ';


teka.dictionary.problem = 'The puzzle';
teka.dictionary.usage = 'Usage';
teka.dictionary.usage_applet = 'General controls';

// -------------------------------------
// -------------------------------------
// ------ PUZZLE SPECIFIC ENTRIES ------
// -------------------------------------

//Kropki

teka.dictionary.kropki =  'Kropki';


teka.dictionary.kropki_instructions =  'Fill the diagram using only the given numbers. '
    +'The same number cannot occur more than once in each row or column respectively.\n\n'
    +'A black circle between two fields indicates that the number in one of the two fields must be exactly double the number in the other field. '
    +'\n\n'
    +'A white circle between two fields indicates that the numbers in the fields must be numerically adjacent. '
    +'\n\n'
    +'If no circle symbol is found between two fields, neither of the above numerical relations may be satisfied by the respective entries. '
    +'';
teka.dictionary.kropki_usage = 'Mouse input: \n\n'
    +'Only left mouse button clicks are activated. Hovering over the applet activates the fields, the currently active field is highlighted.'
    + 'The first click changes the entry of the field to "1". Each consecutive button click will increase the numerical value by one. '
    +'When the highest possible number is reached the next click will erase the field entry and you can start over. '
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n\n'
    +'Keyboard input: \n\n'
    +'Arrow keys: select active field\n'
    +'Num keys:  Set the respective number as entry for the active field\n'
    +'Space:  Remove entry of the active field\n'
    +'# and ;:  Toggle the expert mode. '
    +'In the expert mode you can hide/unhide numbers individually using the num keys. '
    +'\n\n\n'
    +'Note:  The expert mode can only be used if the Kropki contains nine or fewer numbers.';

teka.dictionary.kropki_unique_symbol =  'The highlighted field does not contain a unique entry.';
teka.dictionary.kropki_empty =  'The highlighted field is empty.';
teka.dictionary.kropki_row_duplicate =  'The highlighted numbers occur more than once in the row.';
teka.dictionary.kropki_column_duplicate =  'The highlighted numbers occur more than once in the column.';
teka.dictionary.kropki_twice =  'The ratio of the two highlighted numbers is exactly 2.';
teka.dictionary.kropki_neighbours =  'The two highlighted numbers are numerically adjacent.';
teka.dictionary.kropki_no_neighbours =  'The two highlighted numbers are not numerically adjacent.';
teka.dictionary.kropki_not_twice =  'The ratio of the two highlighted numbers is not exactly 2.';
teka.dictionary.kropki_digits =  'Digits from 1 to {1}.';

//Magnetplatten

teka.dictionary.magnets= 'Magnetic Blocks';
teka.dictionary.magnets_instructions= 'Fill the diagram with magnetic and neutral (black) blocks respectively. '
        +' Each magnetic block consists of two poles (+ and -). '
        +'Two halfs with identical polarisation cannot touch each other horizontally or vertically. '
        +'The numbers at the edges tell how many + and - poles are contained in total within the respective row or column.';
teka.dictionary.magnets_usage = 'Mouse input:\n\n'
        +'First click puts a +\nSecond click puts a - \nThird click puts a black block.\n'
        +'Fourth click identifies the block as magnetic, but with undetermined polarisation\nFifth click removes the entry.\n\n\n'
        +'Keyboard input:\n\n'
        +'+/Q: Puts a +\n-/W: Puts a -\nN,A und /: Puts a neutral block\n. und #,S und *: '
        +'Puts a magnetic block with undetermined polarisation. \n'
        +'Space: Removes entry\n\n'
        +'Magnetic blocks with undetermined polarisation are set to a unique polarisation as soon as they touch a defined + or -. ';
teka.dictionary.magnets_prop_size = 'Diagram size {1}.';

teka.dictionary.magnets_empty = 'The highlighted block is empty.';
teka.dictionary.magnets_unique_symbol = 'The highlighted block contains an undetermined polarisation.';
teka.dictionary.magnets_equal_poles = 'Two identical poles touch each other at the highlighted region.';
teka.dictionary.magnets_row_plus = 'The number of + is incorrect in the highlighted row.';
teka.dictionary.magnets_row_minus = 'The number of - is incorrect in the highlighted row.';
teka.dictionary.magnets_column_plus = 'The number of + is incorrect in the highlighted column.';
teka.dictionary.magnets_column_minus = 'The number of - is incorrect in the highlighted column.';

//Starbattle

teka.dictionary.starbattle = 'Starbattle';
teka.dictionary.starbattle_instructions = 'Fill stars into fields of the diagram. '
    +'For each row, each column, and each area, respectively, fill as many stars as indicated below the puzzle. '
    +'One star occupies exactly one cell of the diagram. The stars cannot touch each other, not even diagonally. ';
teka.dictionary.starbattle_usage = 'Mouse input:\n\n'
    +'First click puts a star\nSecond click puts an "empty field" marker (dash)\n'
    +'Third click removes the entry\n\n\n'
    +'Keyboard input:\n\n'
    +'#, * und Q: Put a star\n-, / und W: Put an "empty field" marker (dash)\n'
    +'Space: Removes entry';
teka.dictionary.starbattle_prop_size = 'Diagram size {1}.';
teka.dictionary.starbattle_stars = 'Number of stars per row/column/area: {1}';

teka.dictionary.starbattle_touch = 'The highlighted stars touch each other.';
teka.dictionary.starbattle_row = 'The number of stars is incorrect for the highlighted row.';
teka.dictionary.starbattle_column = 'The number of stars is incorrect for the highlighted column.';
teka.dictionary.starbattle_area = 'The number of stars is incorrect for the highlighted area.';

// Tapa

teka.dictionary.tapa = 'Tapa';
teka.dictionary.tapa_instructions = 'Colour some of the diagram cells in black so that all black cells are '
    +'horizontally or vertically connected and no black 2x2-blocks occur. '
    +'Cells that contain numbers cannot be black. '
    +'\n\n'
    +'The number cells: '
    +'Reading the entries circularly you obtain a sequence of numbers. The neighbouring cells (incl. diagonally) '
    +'contain this sequence of black cells, interrupted by at least one white cell. The numbers identify the  '
    +'length of blocks of consecutive black cells, again seen circularly around the number cell. Each  block of '
    +'black cells belongs to one number. However, the order of these blocks is NOT determined by the order of the numbers.\n\n'
    +'Only black cells are relevent for a correct solution. '
    +'White cells can be marked or be left blank.';
teka.dictionary.tapa_usage = 'Mouse input:\n\n'
    +'First click marks the cell as black\nSecond click marks the field as white (cross marker)\nThird click removes entry\n\n'
    +'Number cells can be marked/unmarked by a single click. '
    +'\n\n\n'
    +'Keyboard input:\n\n'
    +'#, * und Q: Marks a black cell\n-, / und W: Marks a white cell (cross marker)\nSpace: Removes entry\n\n'
    +'Number cells can be marked using  #, *, and Q. The space key removes the mark. ';
teka.dictionary.tapa_prop_size = 'Diagram size {1}.';
teka.dictionary.tapa_2x2 = 'The four highlighted cells mark a black 2x2 block.';
teka.dictionary.tapa_wrong_numbers = 'The black cells around the highlighted cell do not match up with the given numbers.';
teka.dictionary.tapa_not_connected = 'The highlighted cells are not connected with the other black cells.';

//Hashi

teka.dictionary.hashi = 'Hashi';
teka.dictionary.hashi_instructions = 'Connect all islands with each other using horizontal and vertical bridges. '
    +'Bridges cannot cross other bridges or islands. Between two islands can only be a maximum of two bridges. '
    +'The numbers indicate how many bridges end on the repspective island.'
    +'\n\n'
    +'Islands can be marked as "complete", but only the bridges are relevant for a correct solution.';
teka.dictionary.hashi_usage = 'Mouse input:\n\n'
    +'Bridges:\n'
    +'First click sets a horizontal bridge; second click sets a second, parallel horizontal bridge\n'
    +'Third click sets a vertical bridge; fourth click sets a second, parallel vertical bridge\n'
    +'Fifth click removes current entry.\nImpossible bridge constructions (e.g. without endpoint) are'
    +'skipped.\n'
    +'Islands:\n'
    +'First click marks the island\nSecond click removes the marker\n\n\n'
    +'Keyboard input:\n\n'
    +'Bridges:\n'
    +'w: a single horizontal bridge; Shift-W or e: two horizontal bridges (double bridge)\n'
    +'s: a single vertical bridge; Shift-S oder d: two vertical bridges (double bridge)\n'
    +'If the respective bridge is already in place, a click on the key adds a second bridge or '
    +'removes the existing one(s).\n'
    +'Islands:\n'
    +'#, * and Q: Set marker\nSpace: Remove marker';
teka.dictionary.hashi_sums_prop_size = 'Diagram size {1}.';
teka.dictionary.hashi_wrong_bridges = 'The number of bridges from the highlighted island does not match the given number.';
teka.dictionary.hashi_not_connected = 'The highlighted islands are not connected.';

//Jap. Summen

teka.dictionary.japanese_sums = 'Japanese Sums';
teka.dictionary.japanese_sums_instructions = 'Colour some of the diagram cells in black. Use digits 1-N to fill  '
    +'the remaining cells in a way that no digit occurs in any row or column more than once. '
    +'The rows and columns of the diagram then contain blocks of numbers, separated by black cells. '
    +'The numbers outside the diagram contain the sums of these blocks of digits in the correct order. '
    +'Single digit blocks are to be taken into account as well. A question mark indicates the existence of '
    +'a block with unknown sum. It is possible that no information is given in some rows and columns. The respective'
    + 'entries have to be infered from logical deduction alone. '
    +'\n\n'
    +'All digits AND all black cells have to be correctly determined and filled in for a correct solution.';
teka.dictionary.japanese_sums_usage = 'Mouse input:\n\n'
    +'First click marks the cell as a number cell (circle marker)\n '
    +'Second click marks a black cell\n '
    +'The following clicks change the numerical entry of the field consecutively from 1 to N; after that the cell entry is removed.  '
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the expert mode. '
    +'\n\n\n'
    +'Keyboard input:\n\n'
    +'Num keys 1-9: Put down the respective digit\n'
    +'. or O: MArk as number cell (circle marker)\n'
    +'X, B oder S: Mark as black cell\n'
    +'Space: Remove entry\n'
    +'Minus (-): Mark sequences of possible numbers\n'
    +'# and ,: Toggle between standard input and "expert mode". '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.';
teka.dictionary.japanese_sums_prop_size = 'Diagram size {1}.';
teka.dictionary.japanese_sums_digits = 'Numbers from von 1 to {1}.';

teka.dictionary.japanese_sums_empty = 'The highlighted cell is empty.';
teka.dictionary.japanese_sums_not_unique = 'The highlighted cell does not contain a unique entry.';
teka.dictionary.japanese_sums_row_duplicate = 'The highlighted numbers occur more than once in the same row.';
teka.dictionary.japanese_sums_column_duplicate = 'The highlighted numbers occur more than once in the same column.';
teka.dictionary.japanese_sums_row_count = 'The given number of sums does not coincide with the number of number blocks for the highlighted row.';
teka.dictionary.japanese_sums_column_count = 'The given number of sums does not coincide with the number of number blocks for the highlighted column.';
teka.dictionary.japanese_sums_sum_wrong = 'The sum of the highlighted numbers does not coincide with the given sum.';



