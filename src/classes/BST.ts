/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @param {number} key
 * 
 */

export interface NodeInterface {
  key: number;
  left: NodeInterface | null;
  right: NodeInterface | null;
  parent: NodeInterface | null;
}

export class Node implements NodeInterface {

  key: number;
  left: NodeInterface | null;
  right: NodeInterface | null;
  parent: NodeInterface | null;
  constructor(key: number, left = null, right = null, parent = null) {
    this.key = key
    this.left = left
    this.right = right
    this.parent = parent
  }
}

export class BST {
  root: NodeInterface | null;
  constructor() {
    this.root = null
  }

  //node.right exists go down:
    // go right first and after that go left until the left return null and return the node or return the right if it's doesn't have left node.
    
  // go up if the node is leaf node:
    // if the parent is bigger than the current node then parent is the successor.
    // otherwise, go up until the parent is bigger than the current node.

  findInOrderSuccessor(node: NodeInterface): NodeInterface | null {
    let currentNode = node;
    if (currentNode.right !== null) {
      currentNode = currentNode.right;
      while (currentNode.left !== null) {
        currentNode = currentNode.left;
      }
      return currentNode;
    }else if (currentNode.parent !== null) {
      if(node.key < currentNode.parent.key) return currentNode.parent
      while (currentNode.parent !== null) {
        if(currentNode.key > node.key) {
          return currentNode;
        }
        currentNode = currentNode.parent;
      }
    }
    return null
  }


  insert(key: number) {
    if (this.root === null) {
      this.root = new Node(key);
      return;
    }
    let currentNode = this.root;
    const newNode = new Node(key);
    while (currentNode !== null) {
      if (key < currentNode.key) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          newNode.parent = currentNode;
          break;
        } else {
          currentNode = currentNode.left;
        }
      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          newNode.parent = currentNode;
          break;
        } else {
          currentNode = currentNode.right;
        }
      }
    }

  }

  getNodeByKey(key: number): NodeInterface | null {
    let currentNode = this.root;
    while (currentNode !== null) {

      if(key === currentNode.key) return currentNode

      if (key < currentNode.key) {
        currentNode = currentNode.left;
      } else  {
        currentNode = currentNode.right;
      } 
    }
    return null;
  }
}


