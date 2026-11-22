
const $ = id => document.getElementById(id);

let root = null;
let nextId = 0;
let selectedId = null;
let foundId = null;

// ======================================
// 1. CREATE NEW NODE
// ======================================

function newNode(value) {
    return {
        value,
        id: nextId++,
        left: null,
        right: null
    };
}

// ======================================
// 2. INSERT NODE
// ======================================

// Smaller values go LEFT.
// Greater than or equal values go RIGHT.

function insert(node, value) {

    if (!node) {
        return newNode(value);
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else {
        node.right = insert(node.right, value);
    }

    return node;
}

// ======================================
// 3. VALIDATE NUMBER
// ======================================

function numberFrom(text) {

    if (String(text).trim() === "") {
        throw Error("Enter a number.");
    }

    const n = Number(text);

    if (!Number.isFinite(n)) {
        throw Error("Enter a valid number.");
    }

    return n;
}

// ======================================
// 4. GET MULTIPLE VALUES
// ======================================

function sequenceFrom(text) {

    const parts = text.trim()
        .split(/[,\s]+/)
        .filter(Boolean);

    if (!parts.length) {
        throw Error("Enter at least one number.");
    }

    return parts.map(numberFrom);
}

// ======================================
// 5. DISPLAY MESSAGE
// ======================================

function message(text, error = false) {

    $("message").textContent = text;

    $("message").className =
        error ? "message error" : "message";
}

// ======================================
// 6. INSERT INDIVIDUAL VALUE
// ======================================

function insertAction() {

    try {

        const n = numberFrom($("valueInput").value);

        root = insert(root, n);

        selectedId = null;
        foundId = null;

        renderAll();

        message(`${n} inserted into the BST.`);

        $("valueInput").value = "";

    } catch (e) {

        message(e.message, true);
    }
}

// ======================================
// 7. BUILD TREE FROM SEQUENCE
// ======================================

function build() {

    try {

        const values = sequenceFrom(
            $("sequenceInput").value
        );

        root = null;
        nextId = 0;

        selectedId = null;
        foundId = null;

        values.forEach(value => {
            root = insert(root, value);
        });

        renderAll();

        message(
            `BST created with ${values.length} value(s).`
        );

    } catch (e) {

        message(e.message, true);
    }
}

// ======================================
// 8. SEARCH NODE
// ======================================

function find(value) {

    let node = root;

    while (node) {

        if (value === node.value) {
            return node;
        }

        if (value < node.value) {
            node = node.left;
        } else {
            node = node.right;
        }
    }

    return null;
}

function search() {

    try {

        const v = numberFrom(
            $("searchInput").value
        );

        const node = find(v);

        if (node) {

            foundId = node.id;
            selectedId = node.id;

            renderAll();

            message(`${v} found in the BST.`);

        } else {

            foundId = null;

            renderTree();

            message(`${v} was not found.`, true);
        }

    } catch (e) {

        message(e.message, true);
    }
}

// ======================================
// 9. FIND SMALLEST NODE
// ======================================

function minNode(node) {

    while (node && node.left) {
        node = node.left;
    }

    return node;
}

// ======================================
// 10. DELETE NODE
// ======================================

function removeNode(node, value) {

    if (!node) {
        return null;
    }

    if (value < node.value) {

        node.left = removeNode(
            node.left,
            value
        );

    } else if (value > node.value) {

        node.right = removeNode(
            node.right,
            value
        );

    } else {

        // Case 1: No left child
        if (!node.left) {
            return node.right;
        }

        // Case 2: No right child
        if (!node.right) {
            return node.left;
        }

        // Case 3: Two children
        const successor = minNode(node.right);

        node.value = successor.value;

        node.right = removeNode(
            node.right,
            successor.value
        );
    }

    return node;
}

function deleteAction() {

    try {

        const v = numberFrom(
            $("deleteInput").value
        );

        if (!find(v)) {

            message(
                `${v} is not in the tree.`,
                true
            );

            return;
        }

        root = removeNode(root, v);

        selectedId = null;
        foundId = null;

        renderAll();

        message(`One occurrence of ${v} deleted.`);

        $("deleteInput").value = "";

    } catch (e) {

        message(e.message, true);
    }
}

// ======================================
// 11. CLEAR TREE
// ======================================

function clearTree() {

    root = null;
    nextId = 0;

    selectedId = null;
    foundId = null;

    renderAll();

    message("Tree cleared.");
}

// ======================================
// 12. TREE TRAVERSALS
// ======================================

// INORDER: LEFT - NODE - RIGHT

function walkIn(node, result = []) {

    if (node) {

        walkIn(node.left, result);

        result.push(node.value);

        walkIn(node.right, result);
    }

    return result;
}

// PREORDER: NODE - LEFT - RIGHT

function walkPre(node, result = []) {

    if (node) {

        result.push(node.value);

        walkPre(node.left, result);

        walkPre(node.right, result);
    }

    return result;
}

// POSTORDER: LEFT - RIGHT - NODE

function walkPost(node, result = []) {

    if (node) {

        walkPost(node.left, result);

        walkPost(node.right, result);

        result.push(node.value);
    }

    return result;
}

// ======================================
// 13. COLLECT ALL NODES
// ======================================

function nodesOf(node, result = []) {

    if (node) {

        result.push(node);

        nodesOf(node.left, result);

        nodesOf(node.right, result);
    }

    return result;
}

// ======================================
// 14. GET LEAF NODES
// ======================================

function leavesOf(node, result = []) {

    if (node) {

        if (!node.left && !node.right) {
            result.push(node);
        }

        leavesOf(node.left, result);

        leavesOf(node.right, result);
    }

    return result;
}

// ======================================
// 15. HEIGHT OF TREE
// ======================================

// Height is measured using EDGES.
// Empty tree = -1
// Root only = 0

function height(node) {

    return node
        ? 1 + Math.max(
            height(node.left),
            height(node.right)
        )
        : -1;
}

// ======================================
// 16. FORMAT VALUES
// ======================================

function fmt(values) {

    return values.length
        ? values.join(", ")
        : "—";
}

// ======================================
// 17. ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value).replace(
        /[&<>"']/g,
        c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c])
    );
}

// ======================================
// 18. NODE DETAILS
// ======================================

function nodeDetails(id) {

    const all = nodesOf(root);

    const node = all.find(
        x => x.id === id
    );

    if (!node) return;

    let parent = null;

    for (const p of all) {

        if (
            p.left === node ||
            p.right === node
        ) {
            parent = p;
            break;
        }
    }

    const siblings = parent
        ? [parent.left, parent.right]
            .filter(x => x && x !== node)
        : [];

    $("nodeDetails").innerHTML = `

        <div>
            <b>Selected:</b>
            ${escapeHTML(node.value)}
        </div>

        <div>
            <b>Type:</b>
            ${
                !node.left && !node.right
                    ? "Leaf node"
                    : "Internal node"
            }
        </div>

        <div>
            <b>Parent:</b>
            ${
                parent
                    ? escapeHTML(parent.value)
                    : "None (root)"
            }
        </div>

        <div>
            <b>Left child:</b>
            ${
                node.left
                    ? escapeHTML(node.left.value)
                    : "None"
            }
        </div>

        <div>
            <b>Right child:</b>
            ${
                node.right
                    ? escapeHTML(node.right.value)
                    : "None"
            }
        </div>

        <div>
            <b>Sibling:</b>
            ${
                siblings.length
                    ? siblings.map(x =>
                        escapeHTML(x.value)
                    ).join(", ")
                    : "None"
            }
        </div>
    `;
}

// ======================================
// 19. DRAW BINARY SEARCH TREE
// ======================================

function renderTree() {

    const canvas = $("treeCanvas");

    if (!root) {

        canvas.innerHTML = `
            <div class="empty">
                Build a tree or insert a number to get started.
            </div>
        `;

        return;
    }

    // In-order positioning:
    // Left subtree | Parent | Right subtree

    let index = 0;
    let maxDepth = 0;

    const radius = 20;
    const gapX = 78;
    const gapY = 92;
    const margin = 42;

    function position(node, depth) {

        if (!node) return;

        maxDepth = Math.max(maxDepth, depth);

        position(node.left, depth + 1);

        node.x = margin + index * gapX;
        node.y = margin + depth * gapY;

        index++;

        position(node.right, depth + 1);
    }

    position(root, 0);

    const all = nodesOf(root);

    const width = Math.max(
        180,
        margin * 2 + (all.length - 1) * gapX
    );

    const heightPx =
        margin * 2 + maxDepth * gapY;

    const edges = [];
    const circles = [];

    function draw(node) {

        if (!node) return;

        // Draw left and right arrows
        for (const child of [
            node.left,
            node.right
        ]) {

            if (!child) continue;

            const dx = child.x - node.x;
            const dy = child.y - node.y;

            const dist = Math.hypot(dx, dy);

            const startX =
                node.x + dx / dist * (radius - 2);

            const startY =
                node.y + dy / dist * (radius - 2);

            const endX =
                child.x - dx / dist * (radius + 6);

            const endY =
                child.y - dy / dist * (radius + 6);

            edges.push(`
                <line
                    class="edge"
                    x1="${startX}"
                    y1="${startY}"
                    x2="${endX}"
                    y2="${endY}"
                    marker-end="url(#bstArrow)"
                />
            `);
        }

        let cls =
            node === root
                ? "root"
                : "normal";

        if (node.id === foundId) {
            cls = "found";
        }

        if (node.id === selectedId) {
            cls += " selected";
        }

        circles.push(`

            <g
                class="node ${cls}"
                data-id="${node.id}"
                tabindex="0"
                role="button"
            >

                <circle
                    cx="${node.x}"
                    cy="${node.y}"
                    r="${radius}"
                />

                <text
                    x="${node.x}"
                    y="${node.y}"
                >
                    ${escapeHTML(node.value)}
                </text>

            </g>
        `);

        draw(node.left);

        draw(node.right);
    }

    draw(root);

    canvas.innerHTML = `

        <svg
            class="tree-svg"
            width="${width}"
            height="${heightPx}"
            viewBox="0 0 ${width} ${heightPx}"
            role="img"
            aria-label="Binary search tree"
        >

            <defs>

                <marker
                    id="bstArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >

                    <path
                        d="M0,0 L6,3 L0,6"
                        fill="none"
                        stroke="#536783"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                </marker>

            </defs>

            ${edges.join("")}

            ${circles.join("")}

        </svg>
    `;

    // Make tree nodes clickable
    canvas.querySelectorAll(".node").forEach(el => {

        const select = () => {

            selectedId = Number(el.dataset.id);

            renderTree();

            nodeDetails(selectedId);
        };

        el.addEventListener("click", select);

        el.addEventListener("keydown", e => {

            if (
                e.key === "Enter" ||
                e.key === " "
            ) {
                e.preventDefault();
                select();
            }
        });
    });
}

// ======================================
// 20. DISPLAY ALL RESULTS
// ======================================

function renderAll() {

    renderTree();

    // Traversals
    $("inorderResult").textContent =
        fmt(walkIn(root));

    $("preorderResult").textContent =
        fmt(walkPre(root));

    $("postorderResult").textContent =
        fmt(walkPost(root));

    const all = nodesOf(root);

    const leaves = leavesOf(root);

    let max = root;

    while (max && max.right) {
        max = max.right;
    }

    // Root
    $("rootResult").textContent =
        root ? root.value : "—";

    // Smallest
    $("minResult").textContent =
        minNode(root)?.value ?? "—";

    // Largest
    $("maxResult").textContent =
        max?.value ?? "—";

    // Height
    $("heightResult").textContent =
        root ? height(root) : "—";

    // Total nodes
    $("countResult").textContent =
        all.length;

    // Leaf count
    $("leafCountResult").textContent =
        leaves.length;

    // Internal nodes
    const internal = all.filter(
        n => n.left || n.right
    );

    $("categoriesResult").innerHTML = `

        <div>
            <b>Internal nodes:</b>
            ${fmt(internal.map(n => n.value))}
        </div>

        <div>
            <b>Leaf nodes:</b>
            ${fmt(leaves.map(n => n.value))}
        </div>
    `;

    if (
        selectedId !== null &&
        all.some(n => n.id === selectedId)
    ) {
        nodeDetails(selectedId);
    } else {

        $("nodeDetails").textContent =
            root
                ? "Click any node in the tree to inspect it."
                : "No node selected.";
    }
}

// ======================================
// 21. BUTTON EVENTS
// ======================================

$("insertBtn").addEventListener(
    "click",
    insertAction
);

$("buildBtn").addEventListener(
    "click",
    build
);

$("searchBtn").addEventListener(
    "click",
    search
);

$("deleteBtn").addEventListener(
    "click",
    deleteAction
);

$("clearBtn").addEventListener(
    "click",
    clearTree
);

// Press Enter to perform actions
$("valueInput").addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") insertAction();
    }
);

$("sequenceInput").addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") build();
    }
);

$("searchInput").addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") search();
    }
);

$("deleteInput").addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") deleteAction();
    }
);

// ======================================
// 22. INITIAL BST EXAMPLE
// ======================================

build();
