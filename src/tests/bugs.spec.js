import {
  addBug,
  assignBugToUser,
  getAssignedBugs,
  getBugsByUser,
  getUnresolvedBugs,
  loadBugs,
  removeBug,
  resolveBug,
} from "../store/bugs";
import configureStore from "../store/configureStore";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("should add the bug to store if it's saved to the server", async () => {
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the bug to store if it's not saved to the server", async () => {
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(500, savedBug);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toHaveLength(0);
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in cache", () => {
      it("they should not fetch from the server", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());//first call
        await store.dispatch(loadBugs()); //second call

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });
    describe("if the bugs don't exist in cache", () => {

      it("they should be fetch from the server and put in the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      })
      describe("loading indicator", () => {
        it("should be true while fetching bugs", () => {
          // fakeAxios.onGet("/bugs").reply(200, [{ id: 1}])
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });
        });
        it("should be false after bugs are fetched", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
        it("should be false if the server returns error", async () => {
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should assign bug to user if its saved to server", async () => {
    fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, userId: 1});
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1, 1));
    
    expect(bugsSlice().list[0].userId).toBe(1);

  })

  it('should remove bug from store if its remove from server', async () => {
    fakeAxios.onDelete('/bugs/1').reply(200, { id: 1});
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(addBug({}));
    await store.dispatch(removeBug(1));

    expect(bugsSlice().list).toHaveLength(0);
  })

  it("should mark bug as resolve if its saved to server", async () => {
    fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark bug as resolve if its not saved to server", async () => {
    fakeAxios.onPatch("/bugs/1").reply(500);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  describe("selectors", () => {
    it("getUnresolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toHaveLength(2);
    });

    it("getAssignedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, userId: 1 },
        { id: 2, userId: 2 },
        { id: 3 },
      ];

      const result = getAssignedBugs(state);

      expect(result).toHaveLength(2);
    });

    it("getBugsByUser", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, userId: 1 },
        { id: 2, userId: 2 },
        { id: 3 },
      ];

      const result = getBugsByUser(1)(state);

      expect(result).toHaveLength(1);
    });
  });
});
