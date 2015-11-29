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

teka.dictionary.check = 'Check';
teka.dictionary.undo = 'Undo';
teka.dictionary.instructions = 'Instructions';
teka.dictionary.back = 'Back';
teka.dictionary.back_to_puzzle = 'Go back to the puzzle';
teka.dictionary.black = 'black';
teka.dictionary.black_a = 'black';
teka.dictionary.blue = 'blue';
teka.dictionary.blue_a = 'blue';
teka.dictionary.brown = 'brown';
teka.dictionary.brown_a = 'brown';
teka.dictionary.change_color = 'Colours all fields {1} with symbols {2}.';
teka.dictionary.check = 'Check solution';
teka.dictionary.check_descr = 'Checks if current solution is correct.';
teka.dictionary.coloring = 'colour';
teka.dictionary.color_of_pen = 'Pen colour: {1}';
teka.dictionary.congratulations = 'Congratulations !!!';
teka.dictionary.continuation = 'Continuation';
teka.dictionary.delete_color = 'Deletes all fields with {1} symbols.';
teka.dictionary.deleting = 'delete';
teka.dictionary.error = 'Unfortunately, an unexpected error has occurred.';
teka.dictionary.green = 'green';
teka.dictionary.green_a = 'green';
teka.dictionary.instructions = 'Instructions';
teka.dictionary.instructions_descr = 'Displays the puzzle description together with instructions for the usage of the applet.';
teka.dictionary.instructions_global = 'Test (Ctrl-Enter): When you click this button the applet will check the current solution. '
    +'For a correct solution, the puzzle will flash in various shades of blue.'
    +'Otherwise, a single wrong entry will be highlighted in red, and a short explanation will be displayed. '
    +'\n\n'
    +'Undo (F3): The last major change will be reverted. Note: the "undo" action itself can be reverted as well by simply clicking the button a second time. '
    +'\n\n'
    +'Instructions (F4): Displays the puzzle description together with instructions for the usage of the applet.\n\n'
    +'Marker colour (F5 - F8): Choose between four different marker colours. Entries can not be overwritten using a different colour. '
    +'\n\n'
    +'Change colour (Shift-F5 - Shift-F8): By clicking you can change the colour of all entries into the current marker colour. '
    +'\n\n'
    +'Delete (Ctrl-F5 - Ctrl-F8): Remove all entries in the respective colour '
    +'\n\n'
    +'Cases (Pg Up/Dn): Click the "plus" symbol in order to start a new case '
    +'You can then try new entries and simply revert back to the former state by clicking the "minus" symbol. Altogether nine case levels are possible.\n\n\n'
    +'Solve the puzzle against the clock: If you have activated the "solve surprise puzzles against the clock" mode in your personal preferences, '
    +'you will first see a start screen when you initiate the applet. That screen contains three buttons and relevant information. Your time recording for the puzzle will '
    +'only be started after you activate the puzzle in the start screen! ';
teka.dictionary.level = 'Level: {1}';
teka.dictionary.load_state = 'Returns to the previously stored state of the solution.';
teka.dictionary.next = 'Continue';
teka.dictionary.orange = 'orange';
teka.dictionary.orange_a = 'orange';
teka.dictionary.pink = 'pink';
teka.dictionary.pink_a = 'pink';
teka.dictionary.problem = 'Problem';
teka.dictionary.save_state = 'Stores the current state of the solution.';
teka.dictionary.set_color = 'Sets the marker colour to {1}.';
teka.dictionary.turkey = 'turquoise';
teka.dictionary.turkey_a = 'turquoise';
teka.dictionary.undo = 'Undo';
teka.dictionary.undo_descr = 'Reverts all changes;  back to the state of the last major change (e.g. delete, changing colour). Pressing the button again reverts this "undo" action.';
teka.dictionary.usage = 'Usage';
teka.dictionary.usage_applet = 'General';


teka.dictionary.kropki =  'Kropki';


teka.dictionary.kropki_instructions =  'Fill the diagram using only the given numbers. '
    +'The same number cannot occur more than once in each row or column respectively.\n\n'
    +'A black circle between two fields indicates that the number in one of the two fields must be exactly double the number in the other field. '
    +'\n\n'
    +'A white circle between two fields indicates that the numbers in the fields must be numerically adjacent. '
    +'\n\n'
    +'If no circle symbol is found between two fields, neither of the above numerical relations may be satisfied by the respective entries. '
    +'';
teka.dictionary.kropki_usage =  'Mouse input: \n\n'
    +'Only left mouse button clicks are activated. Hovering over the applet activates the fields, the currently active field is highlighted.'
    + 'The first click changes the entry of the field to "1". Each consecutive button click will increase the numerical value by one. '
    +'When the highest possible number is reached the next click will erase the field entry and you can start over. '
    +'\n\n'
    +'A click on the lower right corner of a field activates the "expert" mode for this field. '
    +'In the expert mode you can show all possible entries at once and hide/unhide these entries individually.'
    +'A second click on the lower right corner deactivates the exprt mode. '
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
