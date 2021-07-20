import configureStore from "./store/configureStore";
import {
  getUnresolvedBugs,
  loadBugs,
  removeBug,
  assignBugToUser,
} from "./store/bugs";
import { projectAdded } from "./store/projects";
import { userAdded } from "./store/users";


const store = configureStore();
// const unsubscribe = store.subscribe(() => {
//   console.log("Store changed", store.getState());
// });

// store.dispatch(addBug({ description: "a"}));
store.dispatch(loadBugs());



setTimeout(() => {
  store.dispatch(removeBug(4));
  // store.dispatch(assignBugToUser(1, 4));
  // store.dispatch(resolveBug(1));
}, 2000);
// store.dispatch(projectAdded({ name: 'Project 1'}));
// store.dispatch(bugAdded({ description: "Bug 1" }));
// store.dispatch(bugAdded({ description: "Bug 2" }));
// store.dispatch(bugAdded({ description: "Bug 3" }));
// store.dispatch(bugResolved({ id: 1 }));
// store.dispatch(bugRemoved({ id: 2 }));
// store.dispatch(() => {}); // async call
// store.dispatch({ type: "error", payload: { message: "An Error occured" } });
// store.dispatch(userAdded({ name: "Parmeshwar Changulpaye", assignedBugs: [] }));
// store.dispatch(userAdded({ name: 'Surekha Changulpaye', assignedBugs: []}))
// store.dispatch(bugAssignedToUser({ userId: 1, bugId: 2}));
// store.dispatch(bugAssignedToUser({ userId: 2, bugId: 1}));
// console.log('Assigned Users 2: ', getBugsByUser(2)(store.getState()))
// console.log('Assigned Bugs : ', getAssignedBugs(store.getState()))

// const x = getUnresolvedBugs(store.getState());
// const y = getUnresolvedBugs(store.getState())
// console.log(x === y);
// unsubscribe();

// store.dispatch({ type: ACTIONS.BUG_REMOVED, payload: { id: 1 } });
// console.log(store.getState());

// let book = { title: "Harry Potter!"};

// function publish(book) {
//     return produce(book, draftBook => {
//         draftBook.isPublish = true;
//     })
// }

// const MyBook = publish(book);
// console.log("Book", book);
// console.log('Edited', MyBook);
