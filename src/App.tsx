import { BST, NodeInterface } from "./classes/BST";
// import TextEditor from "./components/TextEditor";

function App() {
  const tree = new BST();
  tree.insert(5);
  tree.insert(14);
  tree.insert(11);
  tree.insert(20);
  tree.insert(9);
  tree.insert(12);
  tree.insert(3);
  tree.insert(13);
  tree.insert(8);

  const fonded: NodeInterface | null = tree.getNodeByKey(14);
  const suc = tree.findInOrderSuccessor(fonded as NodeInterface);

  console.log(`funded node :${suc?.key}`);

  // console.log(suc);
  function renderTree(node: NodeInterface | null): JSX.Element | null {
    if (node === null)
      return (
        <center className="space-y-8">
          <span className="rounded-full border text-center border-blue-500  p-3 " />
          <div className="flex justify-between ">
            <div className="" />
            <div className="" />
          </div>
        </center>
      );
    return (
      <center className="space-y-8">
        {/* <div className=" font-bold justify-self-center p-3     "> */}
        <span className="rounded-full border text-center border-blue-500  p-3 m-2">
          {node.key}
        </span>
        {/* </div> */}
        <div className="flex justify-between space-x-4 ">
          <div className="">{node.left && renderTree(node.left)}</div>
          <div className=" ">{node.right && renderTree(node.right)}</div>
        </div>
      </center>
    );
  }

  return (
    <>
      <main className="flex  w-full h-screen items-center justify-center bg-black">
        <div className="flex flex-col  w-screen text-white items-center justify-center">
          {renderTree(tree.root)}
        </div>
        {/* <TextEditor /> */}
      </main>
    </>
  );
}

export default App;
