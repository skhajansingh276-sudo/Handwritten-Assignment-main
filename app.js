/**
 * NotebookGen v2.0 — Enhanced App Logic
 * Features:
 *  - Multi-page support with exact A4/A5/Letter/Legal/B5 dimensions
 *  - WordPress-style rich text editor with toolbar
 *  - Per-character handwriting randomization engine
 *  - Page size selector with orientation toggle
 *  - Custom margins (top/right/bottom/left)
 *  - Assignment templates (homework, lab report, essay, etc.)
 *  - Extended detail fields (roll no, class, subject, professor)
 *  - Page numbering
 *  - Ink smudges, coffee stain, margin doodles
 *  - Image insertion into content
 *  - Download as image (PNG) via html2canvas
 *  - Auto-save / restore from localStorage
 *  - Zoom controls, fullscreen mode
 *  - Toast notification system
 *  - Word, character & page count
 */

document.addEventListener('DOMContentLoaded', () => {

    // ───────────────────────────────────────────
    // PAGE SIZE DEFINITIONS (mm)
    // ───────────────────────────────────────────
    const PAGE_SIZES = {
        'A4': { width: 210, height: 297 },
        'A3': { width: 297, height: 420 },
        'A5': { width: 148, height: 210 },
        'Letter': { width: 215.9, height: 279.4 },
        'Legal': { width: 215.9, height: 355.6 },
        'B5': { width: 176, height: 250 },
    };

    // ───────────────────────────────────────────
    // TEMPLATE DEFINITIONS
    // ───────────────────────────────────────────
    const TEMPLATES = {
        'homework': {
            title: 'Assignment',
            paperStyle: 'ruled',
            inkColor: '#191970', // Blue Black
            fontFamily: "'Kalam', cursive",
            content: `<b>Q1.</b> Define the following terms and explain with examples:<br><br>(a) <br><br>(b) <br><br>(c) <br><br><b>Q2.</b> Write short notes on the following:<br><br>(a) <br><br>(b) <br><br><b>Q3.</b> Solve the following problems:<br><br>(a) <br><br>(b) <br><br><b>Q4.</b> Explain the concepts discussed in class with proper diagrams.<br><br>`,
        },
        'lab-report': {
            title: 'Lab Report',
            paperStyle: 'ruled',
            inkColor: '#111111', // Black
            fontFamily: "'Architects Daughter', cursive",
            content: `<b>Aim:</b><br>To study and demonstrate the concept of...<br><br><b>Apparatus / Software Required:</b><br>• <br>• <br>• <br><br><b>Theory:</b><br><br><br><b>Procedure:</b><br>1. <br>2. <br>3. <br>4. <br><br><b>Observation Table:</b><br><br>
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Input</th>
                            <th>Output</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><br></td>
                            <td><br></td>
                            <td><br></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td><br></td>
                            <td><br></td>
                            <td><br></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td><br></td>
                            <td><br></td>
                            <td><br></td>
                        </tr>
                    </tbody>
                </table><br><b>Result:</b><br><br><br><b>Conclusion:</b><br><br><br><b>Viva Questions:</b><br>1. <br>2. <br>3. <br>`,
        },
        'math-notes': {
            title: 'Calculations',
            paperStyle: 'math',
            inkColor: '#0000CD', // Royal Blue
            fontFamily: "'Architects Daughter', cursive",
            content: `<b>Topic: Mathematics</b><br><br><b>Formulas:</b><br>• <br>• <br><br><b>Solution:</b><br><br><br><b>Final Answer:</b><br><u>Answer: </u>`,
        },
        'essay': {
            title: 'Creative Essay',
            paperStyle: 'blank',
            inkColor: '#191970',
            fontFamily: "'Satisfy', cursive",
            content: `<h2>Introduction</h2><br><br><br><h2>Main Body</h2><br><h3>Point 1</h3><br><br><h3>Point 2</h3><br><br><h3>Point 3</h3><br><br><h2>Conclusion</h2><br><br><br><h2>References</h2><br>1. <br>2. <br>3. <br>`,
        },
        'journal': {
            title: 'Daily Journal',
            paperStyle: 'dotted',
            inkColor: '#4B0082', // Indigo
            fontFamily: "'Indie Flower', cursive",
            content: `<i>Dear Diary,</i><br><br>Today was...<br><br><b>Gratitude:</b><br>1. <br>2. <br><br><b>Goals for Tomorrow:</b><br>• <br>• <br>`,
        },
        'comparison': {
            title: 'Comparison Study',
            paperStyle: 'ruled',
            inkColor: '#191970',
            fontFamily: "'Kalam', cursive",
            content: `<h3>Comparison Analysis</h3><br>
                <table style="width: 80%; margin: 12px auto;">
                    <thead>
                        <tr>
                            <th class="no-border-top no-border-left">Feature</th>
                            <th class="no-border-top">Standard</th>
                            <th class="no-border-top no-border-right">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="no-border-left">Performance</td>
                            <td>Baseline</td>
                            <td class="no-border-right">Enhanced</td>
                        </tr>
                        <tr>
                            <td class="no-border-left">Storage</td>
                            <td>50 GB</td>
                            <td class="no-border-right">Unlimited</td>
                        </tr>
                        <tr>
                            <td class="no-border-left no-border-bottom">Support</td>
                            <td class="no-border-bottom">Email</td>
                            <td class="no-border-right no-border-bottom">24/7 Phone</td>
                        </tr>
                    </tbody>
                </table><br><p>As shown in the table above, the comparison highlights the key differences...</p>`,
        },
        'blank': {
            title: '',
            paperStyle: 'blank',
            inkColor: '#191970',
            fontFamily: "'Kalam', cursive",
            content: '',
        },
        'assignment': {
            title: '', // Kept empty to avoid redundancy with the template content below
            paperStyle: 'ruled',
            inkColor: '#191970',
            fontFamily: "'Indie Flower', cursive",
            content: `
                <div style="text-align:center;margin-bottom:20px;">
                    <h1 style="font-size:1.6em;display:inline-block;border-bottom:2px solid currentColor;padding-bottom:5px;margin-bottom:15px;text-transform:uppercase;">Assignment #01</h1>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:1.1em;border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:15px;">
                    <div style="flex:1;">
                        <div style="margin-bottom:5px;"><b>NAME:</b> <span id="sync-name">John Doe</span></div>
                        <div style="margin-bottom:5px;"><b>ROLL NO:</b> <span id="sync-roll">2024CS101</span></div>
                        <div><b>CLASS:</b> <span id="sync-class">CSE-A, Section B</span></div>
                    </div>
                    <div style="flex:1;text-align:right;">
                        <div style="margin-bottom:5px;"><b>SUBJECT:</b> <span id="sync-subject">Data Structures</span></div>
                        <div style="margin-bottom:5px;"><b>PROFESSOR:</b> <span id="sync-professor">Prof. Alan Turing</span></div>
                        <div><b>DATE:</b> <span id="sync-date">Today</span></div>
                    </div>
                </div>
                <div style="margin-top:30px;">
                    <p><b>Q1. Start writing your assignment response here...</b></p>
                    <p>This is the default professional template designed to give your assignment the most authentic handwriting look. Simply edit the sidebar fields or click on the text to begin typing.</p>
                </div>
            `
        }
    };

    // ───────────────────────────────────────────
    // DOODLE EMOJIS
    // ───────────────────────────────────────────
    const DOODLES = ['★', '☆', '♡', '✿', '✎', '♪', '✧', '◇', '△', '○', '⚡', '☁', '☀', '✓', '→'];

    // ───────────────────────────────────────────
    // DOM REFERENCES
    // ───────────────────────────────────────────
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const nameInput = document.getElementById('student-name');
    const rollInput = document.getElementById('roll-number');
    const classInput = document.getElementById('class-name');
    const dateInput = document.getElementById('assignment-date');
    const subjectInput = document.getElementById('subject-name');
    const professorInput = document.getElementById('professor-name');
    const titleInput = document.getElementById('assignment-title');
    const richEditor = document.getElementById('rich-editor');

    const pagesContainer = document.getElementById('pages-container');
    const paperWrapper = document.getElementById('paper-wrapper');

    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeVal = document.getElementById('font-size-val');
    const colorBtns = document.querySelectorAll('.color-btn');
    const customColorInput = document.getElementById('custom-ink-color');
    const customHexInput = document.getElementById('custom-ink-hex');
    const paperStyleSelect = document.getElementById('paper-style');
    const pageSizeSelect = document.getElementById('page-size');
    const orientBtns = document.querySelectorAll('.orient-btn');

    const marginTopInput = document.getElementById('margin-top');
    const marginRightInput = document.getElementById('margin-right');
    const marginBottomInput = document.getElementById('margin-bottom');
    const marginLeftInput = document.getElementById('margin-left');

    const showPageNumbers = document.getElementById('show-page-numbers');
    const pageNumberPos = document.getElementById('page-number-pos');
    const showHeaderEveryPage = document.getElementById('show-header-every-page');

    const ruledLineColorPicker = document.getElementById('ruled-line-color-picker');
    const marginLineColorPicker = document.getElementById('margin-line-color-picker');
    const paperColorPicker = document.getElementById('paper-color-picker');
    const lineOpacitySlider = document.getElementById('line-opacity-slider');
    const lineNudgeInput = document.getElementById('line-nudge-input');

    const realismSlider = document.getElementById('realism-level');
    const inkVariationSlider = document.getElementById('ink-variation');
    const lineSpacingSlider = document.getElementById('line-spacing');
    const lineSpacingVal = document.getElementById('line-spacing-val');
    
    // Page-specific Margin Overrides
    const marginScope = document.getElementById('margin-scope');
    const targetPageSelect = document.getElementById('target-page-select');
    const letterSpacingSlider = document.getElementById('letter-spacing-range');
    const letterSpacingVal = document.getElementById('letter-spacing-val');
    const wordSpacingSlider = document.getElementById('word-spacing-range');
    const wordSpacingVal = document.getElementById('word-spacing-val');

    const enableSmudgesCheck = document.getElementById('enable-smudges');
    const enableTextureCheck = document.getElementById('enable-paper-texture');
    const enableStainCheck = document.getElementById('enable-paper-stain');
    const enableDoodleCheck = document.getElementById('enable-margin-doodle');
    const enableScannerFxCheck = document.getElementById('enable-scanner-fx');
    const enableVintageCheck = document.getElementById('enable-vintage-paper');

    const printBtn = document.getElementById('print-btn');
    const downloadImgBtn = document.getElementById('download-img-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOpenBtn = document.getElementById('sidebar-open-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const insertImageBtn = document.getElementById('insert-image-btn');
    const insertTableBtn = document.getElementById('insert-table-btn');
    const uploadTxtBtn = document.getElementById('upload-txt-btn');
    const dictateBtn = document.getElementById('dictate-btn');
    const imageFileInput = document.getElementById('image-file-input');
    const txtFileInput = document.getElementById('txt-file-input');
    const btnToday = document.getElementById('btn-today');
    const customFontBtn = document.getElementById('custom-font-btn');
    const customFontInput = document.getElementById('custom-font-input');
    const customPaperBtn = document.getElementById('custom-paper-btn');
    const customPaperInput = document.getElementById('custom-paper-input');

    // Table Modal & Tools
    const tableModal = document.getElementById('table-modal');
    const closeTableModalBtn = document.getElementById('close-table-modal');
    const cancelTableBtn = document.getElementById('cancel-table');
    const confirmTableBtn = document.getElementById('confirm-table');
    const tableRowsInput = document.getElementById('table-rows-input');
    const tableColsInput = document.getElementById('table-cols-input');
    const tableGridChooser = document.getElementById('table-grid-chooser');
    const tableToolsGroup = document.getElementById('table-tools-group');
    const addRowBtn = document.getElementById('add-row-btn');
    const addRowBeforeBtn = document.getElementById('add-row-before-btn');
    const addColBtn = document.getElementById('add-col-btn');
    const addColBeforeBtn = document.getElementById('add-col-before-btn');
    const deleteRowBtn = document.getElementById('delete-row-btn');
    const deleteColBtn = document.getElementById('delete-col-btn');
    const toggleBorderBtn = document.getElementById('toggle-border-btn');
    const toggleOuterBorderBtn = document.getElementById('toggle-outer-border-btn');
    const toggleInnerBorderBtn = document.getElementById('toggle-inner-border-btn');
    const toggleInnerVBtn = document.getElementById('toggle-inner-v-btn');
    const toggleInnerHBtn = document.getElementById('toggle-inner-h-btn');
    const toggleBorderTopBtn = document.getElementById('toggle-border-top-btn');
    const toggleBorderBottomBtn = document.getElementById('toggle-border-bottom-btn');
    const toggleBorderLeftBtn = document.getElementById('toggle-border-left-btn');
    const toggleBorderRightBtn = document.getElementById('toggle-border-right-btn');
    const borderScopeSelect = document.getElementById('border-scope-select');
    const cleanLayoutBtn = document.getElementById('clean-table-layout-btn');
    const balanceColsBtn = document.getElementById('balance-cols-btn');
    const resetTableBtn = document.getElementById('reset-table-btn');

    // Draw Modal features
    const drawBtn = document.getElementById('draw-btn');
    const drawModal = document.getElementById('draw-modal');
    const closeDrawModalBtn = document.getElementById('close-draw-modal');
    const cancelDrawBtn = document.getElementById('cancel-draw');
    const insertDrawBtn = document.getElementById('insert-draw');
    const drawCanvas = document.getElementById('draw-canvas');
    const drawPen = document.getElementById('draw-pen');
    const drawEraser = document.getElementById('draw-eraser');
    const drawColor = document.getElementById('draw-color');
    const drawSize = document.getElementById('draw-size');
    const drawClear = document.getElementById('draw-clear');

    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomFitBtn = document.getElementById('zoom-fit');
    const zoomLevel = document.getElementById('zoom-level');
    const pageInfo = document.getElementById('page-info');
    const pageSizeIndicator = document.getElementById('page-size-indicator');
    const scrollContainer = document.getElementById('paper-scroll-container');

    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const pageCountStat = document.getElementById('page-count-stat');
    const autosaveBadge = document.getElementById('autosave-badge');
    const toastContainer = document.getElementById('toast-container');
    const headingSelect = document.getElementById('heading-select');

    // ───────────────────────────────────────────
    // STATE
    // ───────────────────────────────────────────
    let currentZoom = 1;
    let autosaveTimer = null;
    let renderTimer = null;
    let renderTaskId = 0; // Tracks the current active rendering task
    let currentOrientation = 'portrait';
    let currentInkColor = '#191970';
    let totalPages = 1;
    let customFontUrl = null;
    let customPaperUrl = null;
    let drawMode = 'pen';
    let isDrawing = false; // FIX: Properly declare isDrawing to avoid global leak
    let currentContentHTML = ''; // Stores processed handwriting HTML for export
    let isPrinting = false; // Flag to prevent virtualization from clearing pages during print
    let savedRange = null; // Stores editor selection for modal tools
    let restoredScrollTop = 0; // Tracks scroll position for restoration after render

    // ───────────────────────────────────────────
    // MODERN EDITOR ENGINE (Custom Logic)
    // ───────────────────────────────────────────
    const historyStack = [];
    let historyIndex = -1;
    const MAX_HISTORY = 40; // Reduced to save memory on mobile
    let historyTimer = null;

    function saveSelection() {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            savedRange = sel.getRangeAt(0);
        }
    }

    function restoreSelection() {
        if (savedRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }
    }

    /**
     * Smart History Saver:
     * Saves snapshots only if content changed and adds a debounce for typing.
     */
    function saveHistory(force = false) {
        if (!force) {
            clearTimeout(historyTimer);
            historyTimer = setTimeout(() => saveHistory(true), 1500); // 1.5s delay for typing
            return;
        }

        const html = richEditor.innerHTML;
        if (historyIndex >= 0 && historyStack[historyIndex] === html) return;
        
        if (historyIndex < historyStack.length - 1) {
            historyStack.splice(historyIndex + 1);
        }
        
        historyStack.push(html);
        if (historyStack.length > MAX_HISTORY) {
            historyStack.shift();
        } else {
            historyIndex++;
        }
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            richEditor.innerHTML = historyStack[historyIndex];
            debouncedRender();
        } else showToast('Nothing to undo', 'info', 1000);
    }

    function redo() {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            richEditor.innerHTML = historyStack[historyIndex];
            debouncedRender();
        } else showToast('Nothing to redo', 'info', 1000);
    }

    function applyFormat(command, value = null) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        
        if (['bold', 'italic', 'underline', 'strikethrough'].includes(command)) {
            const tags = { bold: 'B', italic: 'I', underline: 'U', strikethrough: 'S' };
            const tag = tags[command];
            
            let parent = range.commonAncestorContainer;
            if (parent.nodeType === 3) parent = parent.parentNode;
            
            let existing = null;
            let node = parent;
            while (node && node !== richEditor) {
                if (node.tagName === tag) {
                    existing = node;
                    break;
                }
                node = node.parentNode;
            }

            if (existing) {
                // UNWRAP: Remove formatting
                const fragment = document.createDocumentFragment();
                while (existing.firstChild) fragment.appendChild(existing.firstChild);
                existing.parentNode.replaceChild(fragment, existing);
            } else {
                // WRAP: Apply formatting
                const wrapper = document.createElement(tag);
                const contents = range.extractContents();
                
                // NORMALIZATION: Clean up any internal tags of the same type to prevent nesting
                const internalTags = contents.querySelectorAll(tag);
                internalTags.forEach(t => {
                    const frag = document.createDocumentFragment();
                    while(t.firstChild) frag.appendChild(t.firstChild);
                    t.parentNode.replaceChild(frag, t);
                });

                wrapper.appendChild(contents);
                range.insertNode(wrapper);
            }
        } 
        else if (command === 'formatBlock') {
            const blocks = getSelectedBlocks();
            blocks.forEach(block => {
                const newBlock = document.createElement(value || 'DIV');
                newBlock.innerHTML = block.innerHTML;
                block.parentNode.replaceChild(newBlock, block);
            });
        }
        selection.removeAllRanges();
        selection.addRange(range);
        saveHistory();
        debouncedRender();
    }

    function getSelectedBlocks() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return [];
        const range = selection.getRangeAt(0);
        const blocks = [];
        let node = range.startContainer;
        while (node && node !== richEditor) {
            if (['DIV', 'P', 'H1', 'H2', 'H3', 'LI'].includes(node.tagName)) {
                blocks.push(node); break;
            }
            node = node.parentNode;
        }
        return blocks;
    }

    function insertHTMLAtCursor(html) {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            richEditor.innerHTML += html;
            return;
        }
        
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const div = document.createElement('div');
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        
        let lastNode;
        while (div.firstChild) {
            lastNode = div.firstChild;
            frag.appendChild(lastNode);
        }
        
        range.insertNode(frag);
        
        // EXPERT: Move cursor reliably to the end of the newly inserted fragment
        if (lastNode) {
            const newRange = document.createRange();
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
        
        saveHistory(true); // Force save for explicit insertions
        debouncedRender();
    }

    // EXPERT: Page-specific margin overrides
    // Format: { pageNum: { t, r, b, l } }
    let pageOverrides = {};

    // ───────────────────────────────────────────
    // VIRTUALIZATION — Performance for long texts
    // ───────────────────────────────────────────
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const inner = entry.target.querySelector('.inner-container');
            if (inner && !isPrinting) {
                if (entry.isIntersecting || entry.intersectionRatio > 0.05) {
                    if (inner.innerHTML === '' && entry.target.hasAttribute('data-content-cache')) {
                        inner.innerHTML = entry.target.getAttribute('data-content-cache');
                    }
                    inner.style.visibility = 'visible';
                    inner.style.opacity = '1';
                } else {
                    // MEMORY OPTIMIZATION: Dump DOM content for off-screen pages on mobile to prevent crashes
                    // EXPERT: Only clear if we have more than 6 pages to avoid stutter on short assignments
                    if (isMobile && inner.innerHTML !== '' && totalPages > 6) {
                        entry.target.setAttribute('data-content-cache', inner.innerHTML);
                        inner.innerHTML = '';
                    }
                    inner.style.visibility = 'hidden';
                    inner.style.opacity = '0';
                }
            }
        });
    }, { rootMargin: '800px 0px', threshold: [0, 0.05] });

    // ───────────────────────────────────────────
    // TOAST NOTIFICATION SYSTEM
    // ───────────────────────────────────────────
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { info: 'info', success: 'check_circle', error: 'error', warning: 'warning' };
        toast.innerHTML = `
            <span class="material-icons-round">${icons[type] || 'info'}</span>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ───────────────────────────────────────────
    // COLLAPSIBLE SIDEBAR SECTIONS
    // ───────────────────────────────────────────
    document.querySelectorAll('.section-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            content.classList.toggle('open');
        });
    });

    // Sidebar collapse
    // Auto-collapse sidebar on mobile load
    if (window.innerWidth <= 900) {
        sidebar.classList.add('collapsed');
        sidebarToggle.querySelector('.material-icons-round').textContent = 'chevron_right';
        sidebarOpenBtn.style.display = 'flex';
    }

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        const icon = sidebarToggle.querySelector('.material-icons-round');
        icon.textContent = isCollapsed ? 'chevron_right' : 'chevron_left';
        sidebarOpenBtn.style.display = isCollapsed ? 'flex' : 'none';
        
        if (window.innerWidth <= 900) {
            sidebarOverlay.classList.toggle('visible', !isCollapsed);
        }
    });

    sidebarOpenBtn.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
        sidebarToggle.querySelector('.material-icons-round').textContent = 'chevron_left';
        sidebarOpenBtn.style.display = 'none';
        if (window.innerWidth <= 900) {
            sidebarOverlay.classList.add('visible');
        }
    });

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
            sidebarToggle.querySelector('.material-icons-round').textContent = 'chevron_right';
            sidebarOpenBtn.style.display = 'flex';
            sidebarOverlay.classList.remove('visible');
        });
    }

    // ───────────────────────────────────────────
    // TOOLBAR EVENT LISTENERS (Updated to use Modern Engine)
    // ───────────────────────────────────────────
    document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.getAttribute('data-command');
            
            if (command === 'undo') undo();
            else if (command === 'redo') redo();
            else if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
                applyFormat(command.toLowerCase());
            } else if (command === 'insertUnorderedList') {
                document.execCommand('insertUnorderedList', false, null);
                saveHistory();
            } else if (command === 'insertOrderedList') {
                document.execCommand('insertOrderedList', false, null);
                saveHistory();
            } else {
                document.execCommand(command, false, null);
                saveHistory();
            }
            
            richEditor.focus();
            updateToolbarState();
        });
    });

    headingSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        applyFormat('formatBlock', value);
        richEditor.focus();
    });

    function updateToolbarState() {
        document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
            const command = btn.getAttribute('data-command');
            try {
                if (document.queryCommandState(command)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            } catch (e) {}
        });
    }

    richEditor.addEventListener('mouseup', updateToolbarState);
    richEditor.addEventListener('keyup', (e) => {
        updateToolbarState();
        if (e.key === ' ' || e.key === 'Enter') saveHistory();
    });

    richEditor.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboardData = (e.originalEvent || e).clipboardData;
        const htmlData = clipboardData.getData('text/html');
        const text = clipboardData.getData('text/plain');

        if (htmlData && /<table[\s>]/i.test(htmlData)) {
            const temp = document.createElement('div');
            temp.innerHTML = htmlData;
            temp.querySelectorAll('style, meta, link, script, head').forEach(el => el.remove());
            temp.querySelectorAll('*:not(table):not(thead):not(tbody):not(tfoot):not(tr):not(td):not(th)').forEach(el => {
                el.removeAttribute('style');
                el.removeAttribute('class');
            });
            temp.querySelectorAll('table, thead, tbody, tfoot, tr, td, th').forEach(el => {
                el.removeAttribute('style');
                el.removeAttribute('class');
                el.removeAttribute('width');
                el.removeAttribute('height');
            });
            insertHTMLAtCursor(temp.innerHTML);
            showToast('Table pasted successfully ✨', 'success');
        } else {
            const paragraphs = text.split(/\n\s*\n/);
            const html = paragraphs.map(para => {
                const reflowed = para.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                return `<div>${reflowed}</div>`;
            }).filter(p => p !== '<div></div>').join('<div><br></div>');
            insertHTMLAtCursor(html);
        }
    });

    // ───────────────────────────────────────────
    // IMAGE INSERTION (Updated)
    // ───────────────────────────────────────────
    insertImageBtn.addEventListener('click', () => {
        imageFileInput.click();
    });

    imageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const imgHTML = `<img src="${ev.target.result}" style="max-width:90%; max-height:200px; display:block; margin:8px auto; border-radius:4px;">`;
            insertHTMLAtCursor(imgHTML);
            showToast('Image inserted ✨', 'success');
        };
        reader.readAsDataURL(file);
        imageFileInput.value = '';
    });

    // ───────────────────────────────────────────
    // CUSTOM TABLE LOGIC (Google Docs style)
    // ───────────────────────────────────────────
    if (insertTableBtn && tableModal) {
        // Initialize 10x10 grid in modal
        function initGridChooser() {
            tableGridChooser.innerHTML = '';
            for (let r = 1; r <= 10; r++) {
                for (let c = 1; c <= 10; c++) {
                    const square = document.createElement('div');
                    square.className = 'grid-square';
                    square.dataset.row = r;
                    square.dataset.col = c;
                    
                    square.addEventListener('mouseover', () => highlightGrid(r, c));
                    square.addEventListener('click', () => {
                        tableRowsInput.value = r;
                        tableColsInput.value = c;
                        insertCustomTable(r, c);
                        closeTableModal();
                    });
                    tableGridChooser.appendChild(square);
                }
            }
        }

        function highlightGrid(rows, cols) {
            const squares = tableGridChooser.querySelectorAll('.grid-square');
            squares.forEach(sq => {
                const r = parseInt(sq.dataset.row);
                const c = parseInt(sq.dataset.col);
                if (r <= rows && c <= cols) {
                    sq.classList.add('active');
                } else {
                    sq.classList.remove('active');
                }
            });
            tableRowsInput.value = rows;
            tableColsInput.value = cols;
        }

        function closeTableModal() {
            tableModal.classList.remove('active');
        }

        insertTableBtn.addEventListener('click', () => {
            initGridChooser();
            tableModal.classList.add('active');
            highlightGrid(3, 3); // Default view
        });

        closeTableModalBtn.addEventListener('click', closeTableModal);
        cancelTableBtn.addEventListener('click', closeTableModal);

        confirmTableBtn.addEventListener('click', () => {
            insertCustomTable(parseInt(tableRowsInput.value), parseInt(tableColsInput.value));
            closeTableModal();
        });

        function insertCustomTable(rows, cols) {
            // EXPERT: Removed rigid inline styles like border-collapse to allow our sketchy handwriting CSS to take full effect.
            let tableHTML = `<table><thead><tr>`;
            for (let c = 0; c < cols; c++) {
                tableHTML += `<th>Header ${c + 1}</th>`;
            }
            tableHTML += `</tr></thead><tbody>`;
            for (let r = 0; r < rows - 1; r++) {
                tableHTML += `<tr>`;
                for (let c = 0; c < cols; c++) {
                    tableHTML += `<td><br></td>`;
                }
                tableHTML += `</tr>`;
            }
            tableHTML += `</tbody></table><p><br></p>`;

            insertHTMLAtCursor(tableHTML);
            showToast(`Table (${rows}x${cols}) inserted ✨`, 'success');
        }
    }

    // Row/Col Management
    function getActiveCell() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;
        let node = sel.getRangeAt(0).startContainer;
        while (node && node !== richEditor) {
            if (node.nodeType === 1 && (node.tagName === 'TD' || node.tagName === 'TH')) return node;
            node = node.parentNode;
        }
        return null;
    }

    addRowBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const row = cell.parentNode;
        const newRow = row.cloneNode(true);
        newRow.querySelectorAll('td, th').forEach(c => c.innerHTML = '<br>');
        row.parentNode.insertBefore(newRow, row.nextSibling);
        debouncedRender();
    });

    addRowBeforeBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const row = cell.parentNode;
        const newRow = row.cloneNode(true);
        newRow.querySelectorAll('td, th').forEach(c => c.innerHTML = '<br>');
        row.parentNode.insertBefore(newRow, row);
        debouncedRender();
    });

    addColBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const table = cell.closest('table');
        const colIndex = cell.cellIndex;
        Array.from(table.rows).forEach(row => {
            const newCell = row.cells[colIndex].cloneNode(true);
            newCell.innerHTML = '<br>';
            row.insertBefore(newCell, row.cells[colIndex].nextSibling);
        });
        debouncedRender();
    });

    if (cleanLayoutBtn) {
        cleanLayoutBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            
            const scope = borderScopeSelect ? borderScopeSelect.value : 'cell';
            const table = cell.closest('table');
            let targets = [cell];

            if (scope === 'row') targets = Array.from(cell.parentNode.cells);
            else if (scope === 'column') {
                const colIndex = cell.cellIndex;
                targets = Array.from(table.rows).map(row => row.cells[colIndex]).filter(c => !!c);
            }
            else if (scope === 'table') targets = Array.from(table.querySelectorAll('td, th'));

            // "Clean" means only horizontal lines: hide ALL Left and Right lines in scope
            targets.forEach(t => {
                t.classList.remove('no-border-top');
                t.classList.remove('no-border-bottom');
                t.classList.add('no-border-left');
                t.classList.add('no-border-right');
                
                // EXPERT: Also silence the neighbors' opposite sides to be thorough
                const rowIndex = t.parentNode.rowIndex;
                const colIndex = t.cellIndex;
                // Left neighbor
                if (colIndex > 0) {
                    const leftN = t.parentNode.cells[colIndex - 1];
                    if (leftN) leftN.classList.add('no-border-right');
                }
                // Right neighbor
                if (colIndex < t.parentNode.cells.length - 1) {
                    const rightN = t.parentNode.cells[colIndex + 1];
                    if (rightN) rightN.classList.add('no-border-left');
                }
            });
            
            if (scope === 'table') {
                table.classList.remove('no-borders');
                // Tables in separate mode have an outer border too.
                // For a "clean" look, we hide the left and right of the main table.
                table.style.borderLeftColor = 'transparent';
                table.style.borderRightColor = 'transparent';
                table.style.borderTopColor = '';
                table.style.borderBottomColor = '';
            }
            
            showToast('Expert horizontal layout applied 📋', 'success');
            checkTableContext();
            debouncedRender();
        });
    }

    if (balanceColsBtn) {
        balanceColsBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            const cols = table.rows[0].cells.length;
            const percent = (100 / cols).toFixed(2);
            
            table.style.tableLayout = 'fixed';
            table.style.width = '100%';
            
            Array.from(table.rows).forEach(row => {
                Array.from(row.cells).forEach(c => {
                    c.style.width = `${percent}%`;
                });
            });
            showToast('Columns balanced (Equal width) 📏', 'success');
            debouncedRender();
        });
    }

    if (resetTableBtn) {
        resetTableBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            
            table.classList.remove('no-borders');
            table.style.borderStyle = '';
            table.style.tableLayout = 'auto';
            table.style.width = '100%';
            
            const sideClasses = ['no-border-top', 'no-border-bottom', 'no-border-left', 'no-border-right'];
            table.querySelectorAll('td, th').forEach(c => {
                sideClasses.forEach(cls => c.classList.remove(cls));
                c.style.width = '';
            });
            
            showToast('Table layout reset ✨', 'info');
            checkTableContext();
            debouncedRender();
        });
    }

    addColBeforeBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const table = cell.closest('table');
        const colIndex = cell.cellIndex;
        Array.from(table.rows).forEach(row => {
            const newCell = row.cells[colIndex].cloneNode(true);
            newCell.innerHTML = '<br>';
            row.insertBefore(newCell, row.cells[colIndex]);
        });
        debouncedRender();
    });

    deleteRowBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const row = cell.parentNode;
        const table = cell.closest('table');
        if (table.rows.length > 1) {
            row.remove();
            debouncedRender();
        } else {
            showToast('Cannot delete last row', 'warning');
        }
    });

    deleteColBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        const table = cell.closest('table');
        const colIndex = cell.cellIndex;
        if (table.rows[0].cells.length > 1) {
            Array.from(table.rows).forEach(row => {
                row.deleteCell(colIndex);
            });
            debouncedRender();
        } else {
            showToast('Cannot delete last column', 'warning');
        }
    });

    toggleBorderBtn.addEventListener('click', () => {
        const cell = getActiveCell();
        if (!cell) return;
        
        const scope = borderScopeSelect ? borderScopeSelect.value : 'cell';
        const table = cell.closest('table');
        let targets = [cell];

        if (scope === 'row') {
            targets = Array.from(cell.parentNode.cells);
        } else if (scope === 'column') {
            const colIndex = cell.cellIndex;
            targets = Array.from(table.rows).map(row => row.cells[colIndex]).filter(c => !!c);
        } else if (scope === 'table') {
            targets = Array.from(table.querySelectorAll('td, th'));
            table.classList.toggle('no-borders');
            if (table.classList.contains('no-borders')) {
                table.style.borderStyle = 'hidden';
            } else {
                table.style.borderStyle = '';
            }
        }

        const sideClasses = ['no-border-top', 'no-border-bottom', 'no-border-left', 'no-border-right'];
        
        if (scope !== 'table') {
            const anyVisible = targets.some(t => {
                return !sideClasses.every(cls => t.classList.contains(cls));
            });

            targets.forEach(t => {
                if (anyVisible) {
                    sideClasses.forEach(cls => t.classList.add(cls));
                } else {
                    sideClasses.forEach(cls => t.classList.remove(cls));
                }
            });
            showToast(anyVisible ? 'Borders hidden 🌫️' : 'Borders restored ✨', 'info');
        } else {
             if (table.classList.contains('no-borders')) {
                 targets.forEach(t => sideClasses.forEach(cls => t.classList.add(cls)));
             } else {
                 targets.forEach(t => sideClasses.forEach(cls => t.classList.remove(cls)));
             }
        }

        checkTableContext();
        debouncedRender();
    });

    if (toggleOuterBorderBtn) {
        toggleOuterBorderBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            const rows = Array.from(table.rows);
            if (rows.length === 0) return;

            const firstRow = rows[0];
            const lastRow = rows[rows.length - 1];
            const isTopHidden = Array.from(firstRow.cells).every(c => c.classList.contains('no-border-top'));
            const newState = isTopHidden ? 'show' : 'hide';

            rows.forEach((row, rIdx) => {
                const cells = Array.from(row.cells);
                cells.forEach((c, cIdx) => {
                    if (rIdx === 0) {
                        if (newState === 'hide') c.classList.add('no-border-top');
                        else c.classList.remove('no-border-top');
                    }
                    if (rIdx === rows.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-bottom');
                        else c.classList.remove('no-border-bottom');
                    }
                    if (cIdx === 0) {
                        if (newState === 'hide') c.classList.add('no-border-left');
                        else c.classList.remove('no-border-left');
                    }
                    if (cIdx === cells.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-right');
                        else c.classList.remove('no-border-right');
                    }
                });
            });

            showToast(newState === 'hide' ? 'Outer frame hidden 🔳' : 'Outer frame shown 🔲', 'info');
            checkTableContext();
            debouncedRender();
        });
    }

    if (toggleInnerBorderBtn) {
        toggleInnerBorderBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            const rows = Array.from(table.rows);
            
            let anyInnerVHidden = false;
            if (rows[0] && rows[0].cells.length > 1) {
                anyInnerVHidden = rows[0].cells[0].classList.contains('no-border-right');
            }
            const newState = anyInnerVHidden ? 'show' : 'hide';

            rows.forEach((row, rIdx) => {
                const cells = Array.from(row.cells);
                cells.forEach((c, cIdx) => {
                    if (rIdx < rows.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-bottom');
                        else c.classList.remove('no-border-bottom');
                    }
                    if (rIdx > 0) {
                        if (newState === 'hide') c.classList.add('no-border-top');
                        else c.classList.remove('no-border-top');
                    }
                    if (cIdx < cells.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-right');
                        else c.classList.remove('no-border-right');
                    }
                    if (cIdx > 0) {
                        if (newState === 'hide') c.classList.add('no-border-left');
                        else c.classList.remove('no-border-left');
                    }
                });
            });

            showToast(newState === 'hide' ? 'Inner borders hidden 💠' : 'Inner borders shown 🔲', 'info');
            checkTableContext();
            debouncedRender();
        });
    }

    if (toggleInnerVBtn) {
        toggleInnerVBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            const rows = Array.from(table.rows);
            
            let anyInnerVHidden = false;
            if (rows[0] && rows[0].cells.length > 1) {
                anyInnerVHidden = rows[0].cells[0].classList.contains('no-border-right');
            }
            const newState = anyInnerVHidden ? 'show' : 'hide';

            rows.forEach((row) => {
                const cells = Array.from(row.cells);
                cells.forEach((c, cIdx) => {
                    if (cIdx < cells.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-right');
                        else c.classList.remove('no-border-right');
                    }
                    if (cIdx > 0) {
                        if (newState === 'hide') c.classList.add('no-border-left');
                        else c.classList.remove('no-border-left');
                    }
                });
            });

            showToast(newState === 'hide' ? 'Column separators hidden 🧱' : 'Column separators shown 📏', 'info');
            checkTableContext();
            debouncedRender();
        });
    }

    if (toggleInnerHBtn) {
        toggleInnerHBtn.addEventListener('click', () => {
            const cell = getActiveCell();
            if (!cell) return;
            const table = cell.closest('table');
            const rows = Array.from(table.rows);
            
            let anyInnerHHidden = false;
            if (rows.length > 1) {
                anyInnerHHidden = rows[0].cells[0].classList.contains('no-border-bottom');
            }
            const newState = anyInnerHHidden ? 'show' : 'hide';

            rows.forEach((row, rIdx) => {
                const cells = Array.from(row.cells);
                cells.forEach((c, cIdx) => {
                    if (rIdx < rows.length - 1) {
                        if (newState === 'hide') c.classList.add('no-border-bottom');
                        else c.classList.remove('no-border-bottom');
                    }
                    if (rIdx > 0) {
                        if (newState === 'hide') c.classList.add('no-border-top');
                        else c.classList.remove('no-border-top');
                    }
                });
            });

            showToast(newState === 'hide' ? 'Row separators hidden 🧱' : 'Row separators shown 📏', 'info');
            checkTableContext();
            debouncedRender();
        });
    }

    // Detect if cursor is inside a table to show/hide tools
    function checkTableContext() {
        const cell = getActiveCell();
        if (cell) {
            tableToolsGroup.style.display = 'flex';
            const table = cell.closest('table');
            
            // Update All Borders button
            const isNoBorder = table.classList.contains('no-borders');
            toggleBorderBtn.classList.toggle('active', isNoBorder);
            toggleBorderBtn.querySelector('.material-icons-round').textContent = isNoBorder ? 'grid_off' : 'grid_on';

            const rows = Array.from(table.rows);
            if (rows.length > 0) {
                const firstRow = rows[0];
                const lastRow = rows[rows.length - 1];
                
                // Outer Border Active State
                const isOuterHidden = Array.from(firstRow.cells).every(c => c.classList.contains('no-border-top')) &&
                                      Array.from(lastRow.cells).every(c => c.classList.contains('no-border-bottom'));
                toggleOuterBorderBtn?.classList.toggle('active', isOuterHidden);

                // Inner Border Active State
                let isInnerVHidden = false;
                if (firstRow.cells.length > 1) {
                    isInnerVHidden = Array.from(rows).every(r => r.cells[0].classList.contains('no-border-right'));
                }
                toggleInnerVBtn?.classList.toggle('active', isInnerVHidden);

                let isInnerHHidden = false;
                if (rows.length > 1) {
                    isInnerHHidden = Array.from(firstRow.cells).every(c => c.classList.contains('no-border-bottom'));
                }
                toggleInnerHBtn?.classList.toggle('active', isInnerHHidden);

                toggleInnerBorderBtn?.classList.toggle('active', isInnerVHidden && isInnerHHidden);
            }

            // Update individual border buttons (active if border is HIDDEN)
            toggleBorderTopBtn.classList.toggle('active', cell.classList.contains('no-border-top'));
            toggleBorderBottomBtn.classList.toggle('active', cell.classList.contains('no-border-bottom'));
            toggleBorderLeftBtn.classList.toggle('active', cell.classList.contains('no-border-left'));
            toggleBorderRightBtn.classList.toggle('active', cell.classList.contains('no-border-right'));
        } else {
            tableToolsGroup.style.display = 'none';
        }
    }

    // Individual Border Toggle Listeners (Surgical - NO neighbor side effects)
    [
        { btn: toggleBorderTopBtn, cls: 'no-border-top' },
        { btn: toggleBorderBottomBtn, cls: 'no-border-bottom' },
        { btn: toggleBorderLeftBtn, cls: 'no-border-left' },
        { btn: toggleBorderRightBtn, cls: 'no-border-right' }
    ].forEach(item => {
        if (item.btn) {
            item.btn.addEventListener('click', () => {
                const cell = getActiveCell();
                if (!cell) return;
                
                const scope = borderScopeSelect ? borderScopeSelect.value : 'cell';
                const table = cell.closest('table');
                let targets = [cell];

                if (scope === 'row') {
                    targets = Array.from(cell.parentNode.cells);
                } else if (scope === 'column') {
                    const colIndex = cell.cellIndex;
                    targets = Array.from(table.rows).map(row => row.cells[colIndex]).filter(c => !!c);
                } else if (scope === 'table') {
                    targets = Array.from(table.querySelectorAll('td, th'));
                }

                const anyHidden = targets.some(t => t.classList.contains(item.cls));
                targets.forEach(t => {
                    if (anyHidden) t.classList.remove(item.cls);
                    else t.classList.add(item.cls);
                });

                checkTableContext();
                debouncedRender();
            });
        }
    });

    richEditor.addEventListener('keyup', checkTableContext);
    richEditor.addEventListener('mouseup', checkTableContext);
    richEditor.addEventListener('click', checkTableContext);

    // ───────────────────────────────────────────
    // TEMPLATES
    // ───────────────────────────────────────────
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateKey = card.getAttribute('data-template');
            const template = TEMPLATES[templateKey];
            if (!template) return;

            if (template.content && richEditor.textContent.trim() && !confirm('This will replace your current content. Continue?')) return;

            // Apply style presets
            if (template.paperStyle) {
                paperStyleSelect.value = template.paperStyle;
                paperStyleSelect.dispatchEvent(new Event('change'));
            }
            if (template.inkColor) {
                setInkColor(template.inkColor, false);
            }
            if (template.fontFamily) {
                fontFamilySelect.value = template.fontFamily;
                fontFamilySelect.dispatchEvent(new Event('change'));
            }

            titleInput.value = template.title;
            if (template.content !== undefined) {
                richEditor.innerHTML = template.content;
            }
            
            updateHeaderFields();
            renderContent();
            showToast(`${templateKey.replace('-', ' ')} template loaded ✨`, 'success');
            triggerAutosave();
        });
    });

    // ───────────────────────────────────────────
    // PAGE SIZE & ORIENTATION
    // ───────────────────────────────────────────
    function getPageDimensions() {
        const size = PAGE_SIZES[pageSizeSelect.value] || PAGE_SIZES['A4'];
        if (currentOrientation === 'landscape') {
            return { width: size.height, height: size.width };
        }
        return { width: size.width, height: size.height };
    }

    function updatePageSize() {
        const dim = getPageDimensions();
        document.documentElement.style.setProperty('--paper-width', `${dim.width}mm`);
        document.documentElement.style.setProperty('--paper-height', `${dim.height}mm`);

        // Update style/print first then re-render content for page count
        updatePrintPageSize();
        renderContent();

        // Sync page selector to rendered pages
        const pageCount = totalPages || 1;
        const currentSelected = targetPageSelect.value;
        targetPageSelect.innerHTML = '';
        for (let p = 1; p <= pageCount; p++) {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = `Page ${p}`;
            targetPageSelect.appendChild(opt);
        }
        if (currentSelected && parseInt(currentSelected) <= pageCount) {
            targetPageSelect.value = currentSelected;
        }

        pageSizeIndicator.textContent = `${pageSizeSelect.value} · ${currentOrientation.charAt(0).toUpperCase() + currentOrientation.slice(1)}`;

        triggerAutosave();
    }

    function updatePrintPageSize() {
        let existingStyle = document.getElementById('dynamic-print-style');
        if (existingStyle) existingStyle.remove();

        const dim = getPageDimensions();
        const style = document.createElement('style');
        style.id = 'dynamic-print-style';
        style.textContent = `@media print { @page { size: ${dim.width}mm ${dim.height}mm; margin: 0; } }`;
        document.head.appendChild(style);
    }

    pageSizeSelect.addEventListener('change', updatePageSize);

    orientBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            orientBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOrientation = btn.getAttribute('data-orient');
            updatePageSize();
        });
    });

    // ───────────────────────────────────────────
    // MARGINS
    // ───────────────────────────────────────────
    function updateMargins() {
        const scope = marginScope.value;
        const mt = parseInt(marginTopInput.value) || 0;
        const mr = parseInt(marginRightInput.value) || 0;
        const mb = parseInt(marginBottomInput.value) || 0;
        const ml = parseInt(marginLeftInput.value) || 0;

        if (scope === 'all') {
            // Global Update
            document.documentElement.style.setProperty('--paper-margin-top', `${mt}mm`);
            document.documentElement.style.setProperty('--paper-margin-right', `${mr}mm`);
            document.documentElement.style.setProperty('--paper-margin-bottom', `${mb}mm`);
            document.documentElement.style.setProperty('--paper-margin-left', `${ml}mm`);
            pageOverrides = {}; // Wipe overrides when resetting all
        } else {
            // Page-specific Update
            const pg = parseInt(targetPageSelect.value);
            pageOverrides[pg] = { t: mt, r: mr, b: mb, l: ml };
        }

        renderContent();
        triggerAutosave();
    }

    marginScope.addEventListener('change', () => {
        const isPage = marginScope.value === 'current';
        targetPageSelect.style.display = isPage ? 'inline-block' : 'none';
        
        // If switching to specific page, load those values into the inputs
        if (isPage) {
            syncMarginInputs(parseInt(targetPageSelect.value));
        } else {
            // Switching back to ALL - Restore from CSS variables (Global)
            const root = document.documentElement;
            marginTopInput.value = parseInt(root.style.getPropertyValue('--paper-margin-top')) || 35;
            marginRightInput.value = parseInt(root.style.getPropertyValue('--paper-margin-right')) || 20;
            marginBottomInput.value = parseInt(root.style.getPropertyValue('--paper-margin-bottom')) || 20;
            marginLeftInput.value = parseInt(root.style.getPropertyValue('--paper-margin-left')) || 30;
            
            // EXPERT: Wiping overrides on 'all' is the current behavior, but we call render to reflect global
            pageOverrides = {};
            renderContent();
        }
    });

    targetPageSelect.addEventListener('change', () => {
        syncMarginInputs(parseInt(targetPageSelect.value));
    });

    function syncMarginInputs(pg) {
        if (pageOverrides[pg]) {
            const ov = pageOverrides[pg];
            marginTopInput.value = ov.t;
            marginRightInput.value = ov.r;
            marginBottomInput.value = ov.b;
            marginLeftInput.value = ov.l;
        } else {
            // Default to Global (CSS Vars)
            const root = document.documentElement;
            marginTopInput.value = parseInt(root.style.getPropertyValue('--paper-margin-top')) || 35;
            marginRightInput.value = parseInt(root.style.getPropertyValue('--paper-margin-right')) || 20;
            marginBottomInput.value = parseInt(root.style.getPropertyValue('--paper-margin-bottom')) || 20;
            marginLeftInput.value = parseInt(root.style.getPropertyValue('--paper-margin-left')) || 30;
        }
    }

    [marginTopInput, marginRightInput, marginBottomInput, marginLeftInput].forEach(input => {
        // Use 'input' for real-time reflection, 'change' for final state
        input.addEventListener('input', updateMargins);
    });

    [pageNumberPos, ruledLineColorPicker, marginLineColorPicker, showPageNumbers, paperColorPicker, lineOpacitySlider, lineNudgeInput].forEach(el => {
        el.addEventListener('input', () => {
            if (el === ruledLineColorPicker) {
                document.documentElement.style.setProperty('--ruled-line-color', ruledLineColorPicker.value);
            }
            if (el === marginLineColorPicker) {
                document.documentElement.style.setProperty('--margin-line-color', marginLineColorPicker.value);
            }
            if (el === paperColorPicker) {
                document.documentElement.style.setProperty('--paper-bg', paperColorPicker.value);
            }
            renderContent();
            triggerAutosave();
        });
    });

    // ───────────────────────────────────────────
    // TEXT UPDATES — HEADER FIELDS
    // ───────────────────────────────────────────
    function getHeaderHTML() {
        const name = nameInput.value;
        const roll = rollInput.value;
        const cls = classInput.value;
        const date = dateInput.value;
        const subject = subjectInput.value;
        const professor = professorInput.value;

        let leftHTML = '';
        let rightHTML = '';

        if (name) leftHTML += `<div class="paper-header-field"><span class="field-label">Name:</span> ${applyHandwritingEffect(name)}</div>`;
        if (roll) leftHTML += `<div class="paper-header-field"><span class="field-label">Roll No:</span> ${applyHandwritingEffect(roll)}</div>`;
        if (cls) leftHTML += `<div class="paper-header-field"><span class="field-label">Class:</span> ${applyHandwritingEffect(cls)}</div>`;
        if (date) rightHTML += `<div class="paper-header-field"><span class="field-label">Date:</span> ${applyHandwritingEffect(date)}</div>`;
        if (subject) rightHTML += `<div class="paper-header-field"><span class="field-label">Subject:</span> ${applyHandwritingEffect(subject)}</div>`;
        if (professor) rightHTML += `<div class="paper-header-field"><span class="field-label">Prof:</span> ${applyHandwritingEffect(professor)}</div>`;

        if (!leftHTML && !rightHTML) return '';

        return `
            <div class="paper-header">
                <div class="paper-header-left">${leftHTML}</div>
                <div class="paper-header-right">${rightHTML}</div>
            </div>
        `;
    }

    function getTitleHTML() {
        const title = titleInput.value;
        if (!title.trim()) return '';
        return `<h2 class="paper-title">${applyHandwritingEffect(title)}</h2>`;
    }

    function updateHeaderFields() {
        // EXPERT: We use the more advanced version defined at the bottom of the file
        // which includes template syncing logic.
        if (typeof syncHeaderWithEditor === 'function') syncHeaderWithEditor();
        debouncedRender();
        triggerAutosave();
    }

    [nameInput, rollInput, classInput, dateInput, subjectInput, professorInput, titleInput].forEach(input => {
        if (input) input.addEventListener('input', updateHeaderFields);
    });

    // ───────────────────────────────────────────
    // HANDWRITING ENGINE (Optimized with Caching)
    // ───────────────────────────────────────────
    const handwritingCache = new Map();
    let cachedRealism = 0.6;
    let cachedInkVar = 0.4;

    function getRealism() {
        return cachedRealism;
    }

    function getInkVariation() {
        return cachedInkVar;
    }

    function updateSettingsCache() {
        cachedRealism = (parseInt(realismSlider.value) || 60) / 100;
        cachedInkVar = (parseInt(inkVariationSlider.value) || 40) / 100;
        // Clear cache when settings change significantly
        handwritingCache.clear();
    }
    updateSettingsCache();

    /**
     * Cache key generator based on text and current settings
     */
    function getCacheKey(text) {
        return `${text}|${getRealism()}|${getInkVariation()}`;
    }

    /**
     * Wraps each word in a <span> with random CSS transforms
     * to simulate realistic human handwriting imperfections.
     */
    function applyHandwritingEffect(text) {
        const realism = getRealism();
        const inkVar = getInkVariation();

        if (realism === 0 && inkVar === 0) return escapeHTML(text);

        const key = getCacheKey(text);
        if (text.length < 60 && handwritingCache.has(key)) {
            return handwritingCache.get(key);
        }

        let result = '';
        const tokens = text.split(/(\s+)/);

        // BASELINE DRIFT: Simulates hand gradually rising/falling across the line
        let baselineDrift = 0;
        const driftDirection = (Math.random() - 0.5) * 0.6 * realism;
        const driftMax = 4.5 * realism;
        
        // EXPERT: Humans don't start exactly at the same pixel every time.
        // MARGIN JITTER: Small random offset for the first word of each chunk.
        const marginJitter = (Math.random() - 0.5) * 8.0 * realism; // +/- 4px

        // LINE FLOW: Periodic waving + random baseline wander (bounded to avoid overlaps)
        const flowFreq = 0.35 + Math.random() * 0.2;
        const flowAmp = 1.8 * realism;

        let wordIndex = 0;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (!token) continue;

            if (/^\s+$/.test(token)) {
                if (token.includes('\n')) {
                    let spaceStr = '';
                    for (const ch of token) {
                        if (ch === '\n') spaceStr += '<br>';
                        else spaceStr += ' ';
                    }
                    result += spaceStr;
                    baselineDrift = 0;
                } else {
                    // WORD GAP: Use margin-right for natural spacing between words
                    // This avoids the letter-spacing hack that stretched individual space chars
                    const gapVariation = (Math.random() - 0.35) * 4.0 * realism;
                    result += `<span style="margin-right:${gapVariation.toFixed(1)}px;display:inline">${token}</span>`;
                }
                continue;
            }

            wordIndex++;
            // Update baseline drift (gradual oscillation + micro-jitter)
            baselineDrift += driftDirection + (Math.random() - 0.5) * 0.4 * realism;
            
            // Bounding constraints: Keep it within +/- 4.5px to guarantee no line overlap
            if (Math.abs(baselineDrift) > driftMax) {
                baselineDrift *= 0.6;
            }

            // PER-CHARACTER rendering (realism >= 0.35)
            // PERFORMANCE: Disable per-character for very long documents to prevent browser freeze
            const charLimit = isMobile ? 800 : 3000;
            const isLongDoc = text.length > charLimit;
            if (realism >= 0.35 && token.length <= 30 && !isLongDoc) {
                let wordHTML = '';
                let prevCharRot = 0;
                for (let ci = 0; ci < token.length;ci++) {
                    const ch = token[ci];
                    const rawRot = (Math.random() - 0.5) * 4.0 * realism;
                    const charRot = rawRot * 0.6 + prevCharRot * 0.4;
                    prevCharRot = charRot;

                    // Periodic Wave Displacement (Simulates natural hand movement/wavering)
                    const flowY = Math.sin(wordIndex * flowFreq) * flowAmp;
                    const charY = baselineDrift + flowY + (Math.random() - 0.5) * 1.5 * realism;
                    const charX = marginJitter + (Math.random() - 0.5) * 0.4 * realism;

                    // INK PRESSURE & BLOOM
                    const pressureMul = (ci === 0) ? 1.05 : (0.85 + Math.random() * 0.15);
                    const charScale = (0.97 + Math.random() * 0.05);
                    const charOpacity = (pressureMul - Math.random() * 0.06 * inkVar).toFixed(isMobile ? 1 : 2);
                    const weight = 300 + Math.floor(Math.random() * 200 * realism);
                    const kern = (Math.random() * -0.4 * realism).toFixed(1);

                    // INK SOAK EFFECT (Expensive - skip for multi-page documents or mobile)
                    const isHugeDoc = text.length > (isMobile ? 1500 : 6000);
                    const bloom = (realism > 0.6 && !isHugeDoc && !isMobile) ? `drop-shadow(0 0 ${(0.3*realism).toFixed(2)}px currentColor)` : '';

                    const charTransform = `rotate(${charRot.toFixed(1)}deg) translate(${charX.toFixed(1)}px,${charY.toFixed(1)}px) scale(${charScale.toFixed(2)})`;
                    wordHTML += `<span data-hw="1" style="display:inline-block;transform:${charTransform};opacity:${charOpacity};margin-right:${kern}px;font-weight:${weight};filter:${bloom}">${escapeHTML(ch)}</span>`;
                }
                const wordTilt = (Math.random() - 0.5) * 1.5 * realism;
                const flowY = Math.sin(wordIndex * flowFreq) * flowAmp;
                const wordY = baselineDrift + flowY;
                result += `<span class="hw-word" data-hw="1" style="display:inline-block;transform:rotate(${wordTilt.toFixed(1)}deg) translateY(${wordY.toFixed(1)}px)">${wordHTML}</span>`;
            } else {
                // Word-level transform (High Performance Mode)
                const rotation = (Math.random() - 0.5) * 3.5 * realism;
                const flowY = Math.sin(wordIndex * flowFreq) * flowAmp;
                // INK EXHAUSTION: Some words are slightly 'drier' (more opaque)
                const exhaustion = (Math.random() * 0.15 * inkVar).toFixed(isMobile ? 1 : 2);
                const yOff = baselineDrift + flowY + (Math.random() - 0.5) * 2.5 * realism;
                const scale = 1 + (Math.random() - 0.5) * 0.07 * inkVar;
                const opacity = (1 - exhaustion - Math.random() * 0.05).toFixed(isMobile ? 1 : 2);
                const weight = 400 + Math.floor(Math.random() * 100 * realism);
                const transform = `rotate(${rotation.toFixed(1)}deg) translate(${marginJitter.toFixed(0)}px,${yOff.toFixed(1)}px) scale(${scale.toFixed(2)})`;
                result += `<span class="hw-word" data-hw="1" style="display:inline-block;transform:${transform};opacity:${opacity};font-weight:${weight}">${escapeHTML(token)}</span>`;
            }
        }

        if (text.length < 500) {
            handwritingCache.set(key, result);
        }

        return result;
    }

    /**
     * Apply handwriting effect to rich HTML content.
     * Preserves HTML tags but randomizes text nodes.
     */
    const nodeHandwritingCache = new Map();
    function applyHandwritingToNode(node) {
        const realism = getRealism();
        const inkVar = getInkVariation();
        if (realism === 0 && inkVar === 0) return;

        function process(current) {
            if (current.nodeType === Node.TEXT_NODE) {
                const text = current.textContent;
                if (!text.trim()) return;

                // EXPERT: Avoid double-wrapping. If the parent is already a handwriting span, skip.
                if (current.parentNode && current.parentNode.hasAttribute('data-hw')) return;

                const wrapper = document.createElement('span');
                wrapper.innerHTML = applyHandwritingEffect(text);
                
                const frag = document.createDocumentFragment();
                while(wrapper.firstChild) frag.appendChild(wrapper.firstChild);
                current.parentNode.replaceChild(frag, current);
            } else if (current.nodeType === Node.ELEMENT_NODE) {
                // SKIP IMGS, NO-HW, and ALREADY PROCESSED SPANS
                if (current.tagName === 'IMG' || current.classList.contains('no-hw') || current.hasAttribute('data-hw')) return;
                
                const children = Array.from(current.childNodes);
                children.forEach(process);
            }
        }
        process(node);
    }

    // Keep the HTML string version for simple compatibility but warn about tables
    function applyHandwritingToHTML(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        applyHandwritingToNode(temp);
        return temp.innerHTML;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ───────────────────────────────────────────
    // MULTI-PAGE CONTENT RENDERING (Optimized)
    // ───────────────────────────────────────────
    const measureContainer = document.createElement('div');
    measureContainer.style.cssText = `position: absolute; visibility: hidden; pointer-events: none; top: -9999px; left: -9999px;`;
    document.body.appendChild(measureContainer);

    function createPageElement(pageNum, totalPg) {
        const page = document.createElement('div');
        page.className = `paper paper-${paperStyleSelect.value}`;

        // EXPERT: MARGIN PRECISION - Always fetch global defaults first
        const root = document.documentElement;
        let mtVal = parseInt(root.style.getPropertyValue('--paper-margin-top')) || 35;
        let mrVal = parseInt(root.style.getPropertyValue('--paper-margin-right')) || 20;
        let mbVal = parseInt(root.style.getPropertyValue('--paper-margin-bottom')) || 20;
        let mlVal = parseInt(root.style.getPropertyValue('--paper-margin-left')) || 30;

        // Apply override if it exists for this specific page
        if (pageOverrides[pageNum]) {
            const ov = pageOverrides[pageNum];
            mtVal = ov.t; mrVal = ov.r; mbVal = ov.b; mlVal = ov.l;
        } else if (marginScope.value === 'current' && parseInt(targetPageSelect.value) === pageNum) {
            // Special Case: Current page being edited in "Specific" mode
            mtVal = parseInt(marginTopInput.value) || mtVal;
            mrVal = parseInt(marginRightInput.value) || mrVal;
            mbVal = parseInt(marginBottomInput.value) || mbVal;
            mlVal = parseInt(marginLeftInput.value) || mlVal;
        }

        page.style.padding = `${mtVal}mm ${mrVal}mm ${mbVal}mm ${mlVal}mm`;        
        // Apply texture if enabled
        if (enableTextureCheck.checked && paperStyleSelect.value !== 'blank') {
            page.classList.add('paper-textured');
        }

        // Apply shared styles
        page.style.fontFamily = fontFamilySelect.value;
        page.style.fontSize = `${fontSizeInput.value}px`;
        page.style.lineHeight = `${lineSpacingSlider.value}px`;
        page.style.letterSpacing = `${letterSpacingSlider.value}px`;
        if (wordSpacingSlider) page.style.wordSpacing = `${wordSpacingSlider.value}px`;
        page.style.color = currentInkColor;

        // EXPERT MARGIN PRECISION: Force exact User Margins on every page element
        // This block is redundant as it's already handled above. Keeping for now as per instruction.
        // const mtVal = parseInt(marginTopInput.value) || 0;
        // const mrVal = parseInt(marginRightInput.value) || 0;
        // const mbVal = parseInt(marginBottomInput.value) || 0;
        // const mlVal = parseInt(marginLeftInput.value) || 0;
        // page.style.padding = `${mtVal}mm ${mrVal}mm ${mbVal}mm ${mlVal}mm`;

        // Shared color extraction for dynamic grid-based backgrounds
        const spacing = parseInt(lineSpacingSlider.value) || 34;
        const lineOpacity = (parseInt(lineOpacitySlider.value) / 100) || 0.7;
        const rawColor = getComputedStyle(document.documentElement).getPropertyValue('--ruled-line-color').trim() || '#c2ddf0';
        const r = parseInt(rawColor.slice(1, 3), 16) || 194;
        const g = parseInt(rawColor.slice(3, 5), 16) || 221;
        const b = parseInt(rawColor.slice(5, 7), 16) || 240;
        const gridColor = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
        const nudge = parseInt(lineNudgeInput.value) || 0;
        const mtMm = parseInt(marginTopInput.value) || 0;
        const mtPx = mtMm * 3.7795;
        const offset = (mtPx % spacing) + nudge;

        // Dynamic paper backgrounds
        if (paperStyleSelect.value === 'ruled') {
            const linePos = spacing - 1;
            page.style.backgroundImage = `linear-gradient(transparent ${linePos}px, ${gridColor} ${linePos}px, ${gridColor} ${spacing}px, transparent ${spacing}px)`;
            page.style.backgroundSize = `100% ${spacing}px`;
            page.style.backgroundPosition = `0 ${offset}px`; 
        } else if (paperStyleSelect.value === 'math') {
            page.style.backgroundImage = `
                linear-gradient(${gridColor} 1px, transparent 1px),
                linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `;
            page.style.backgroundSize = `${spacing}px ${spacing}px`;
            page.style.backgroundPosition = `${offset}px ${offset}px`;
        } else if (paperStyleSelect.value === 'dotted') {
            // EXPERT: Dotted grid matches the line spacing for natural layout
            page.style.backgroundImage = `radial-gradient(circle, ${gridColor} 1px, transparent 1.5px)`;
            page.style.backgroundSize = `${spacing}px ${spacing}px`;
            page.style.backgroundPosition = `${offset}px ${offset}px`;
        } else if (paperStyleSelect.value === 'custom' && customPaperUrl) {
            page.style.backgroundImage = `url('${customPaperUrl}')`;
            page.classList.add('custom-paper');
        } else {
            // For blank, we ensure any existing inline bg is cleared
            page.style.backgroundImage = 'none';
        }

        // Fx
        if (enableScannerFxCheck && enableScannerFxCheck.checked) page.classList.add('paper-scanned');
        if (enableVintageCheck && enableVintageCheck.checked) page.classList.add('paper-vintage');

        // EXPERT: Red line should be a classic 6mm to the left of the text margin, or centered if margin is tight.
        // Hides if margin is too narrow (less than 10mm typically in real notebooks)
        if (mlVal >= 10) {
            const marginLine = document.createElement('div');
            marginLine.className = 'margin-line';
            marginLine.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--margin-line-color').trim();
            const linePosMm = mlVal - 6;
            marginLine.style.left = `${linePosMm}mm`;
            page.appendChild(marginLine);
        }

        // Decoration Container
        const smudgesDiv = document.createElement('div');
        smudgesDiv.className = 'smudges-container';
        if (enableSmudgesCheck.checked) generateSmudgesInto(smudgesDiv);
        page.appendChild(smudgesDiv);

        // FIX: Generate margin doodles when enabled
        if (enableDoodleCheck.checked) {
            const doodleCount = 2 + Math.floor(Math.random() * 3);
            for (let d = 0; d < doodleCount; d++) {
                const doodle = document.createElement('div');
                doodle.className = 'margin-doodle';
                doodle.textContent = DOODLES[Math.floor(Math.random() * DOODLES.length)];
                doodle.style.top = `${15 + Math.random() * 70}%`;
                doodle.style.fontSize = `${16 + Math.random() * 14}px`;
                doodle.style.transform = `rotate(${-25 + Math.random() * 50}deg)`;
                doodle.style.opacity = 0.1 + Math.random() * 0.12;
                page.appendChild(doodle);
            }
        }
        if (enableStainCheck.checked && Math.random() > 0.5) {
            const stain = document.createElement('div');
            stain.className = 'coffee-stain';
            stain.style.width = stain.style.height = `${80 + Math.random() * 120}px`;
            stain.style.top = `${10 + Math.random() * 70}%`;
            stain.style.left = `${10 + Math.random() * 60}%`;
            page.appendChild(stain);
        }

        const inner = document.createElement('div');
        inner.className = 'inner-container paper-content';
        page.appendChild(inner);

        // Page Numbering — position dynamically based on actual bottom margin
        if (showPageNumbers.checked) {
            const pgNum = document.createElement('div');
            const pos = pageNumberPos.value || 'center';
            pgNum.className = `page-number page-num-${pos}`;
            pgNum.innerHTML = applyHandwritingEffect(`Page ${pageNum} of ${totalPg}`);
            // FIX: Position page number within the bottom margin area, not at a fixed 25px
            const mbMm = parseInt(marginBottomInput.value) || 0;
            const mbPx = mbMm * 3.779;
            // Place near the bottom edge: centered in margin if margin is big enough
            const pgNumBottom = mbMm >= 10 ? Math.max(mbPx * 0.3, 4) : Math.max(mbPx * 0.15, 2);
            pgNum.style.bottom = `${pgNumBottom}px`;
            if (mbMm < 8) pgNum.style.fontSize = '0.6em';
            page.appendChild(pgNum);
        }

        return page;
    }

    function updateStats() {
        const text = richEditor.textContent || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const pages = pagesContainer.querySelectorAll('.paper').length;
        wordCountEl.textContent = `${words} words`;
        charCountEl.textContent = `${chars} chars`;
        pageCountStat.textContent = `~${pages} pages`;
        pageInfo.textContent = `Page 1 of ${pages}`;
        
        // EXPERT: Update the margin scope page selector
        updateTargetPageSelect(pages);
    }

    function updateTargetPageSelect(totalPages) {
        if (!targetPageSelect) return;
        const currentVal = targetPageSelect.value;
        const oldOptionsCount = targetPageSelect.options.length;
        
        if (oldOptionsCount === totalPages) return; // No change needed

        targetPageSelect.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `Page ${i}`;
            targetPageSelect.appendChild(opt);
        }
        
        // Try to keep previous selection if still valid
        if (currentVal && parseInt(currentVal) <= totalPages) {
            targetPageSelect.value = currentVal;
        } else if (totalPages > 0) {
            targetPageSelect.value = "1";
        }
    }

function renderContent() {
    const taskId = ++renderTaskId;

    // Capture current scroll position for restoration after render
    if (restoredScrollTop === 0 && scrollContainer) {
        restoredScrollTop = scrollContainer.scrollTop;
    }

    let html = richEditor.innerHTML;
    let sanitized = false;
    
    // EXPERT: Sanitize input to prevent "rendering mess" (nested spans)
    if (html.includes('data-hw="1"')) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const badSpans = temp.querySelectorAll('[data-hw="1"]');
        badSpans.forEach(s => s.replaceWith(s.textContent));
        html = temp.innerHTML;
        sanitized = true;
    }

    if (sanitized) {
        // Only update if we actually cleaned something to avoid cursor jumps
        const sel = window.getSelection();
        const offset = sel.rangeCount > 0 ? sel.getRangeAt(0).startOffset : 0;
        richEditor.innerHTML = html;
        // Basic cursor restoration attempt
        try {
            if (sel.rangeCount > 0) {
                const range = document.createRange();
                range.setStart(richEditor.firstChild || richEditor, Math.min(offset, (richEditor.textContent || "").length));
                range.collapse(true);
                sel.removeAllRanges(); sel.addRange(range);
            }
        } catch(e) {}
    }

    const plainText = richEditor.textContent || '';
    const dim = getPageDimensions();
    const pxPerMm = 3.7795275591;

    function getMarginsForPageMm(pageNum) {
        const root = document.documentElement;
        const global = {
            t: parseInt(root.style.getPropertyValue('--paper-margin-top')) || 35,
            r: parseInt(root.style.getPropertyValue('--paper-margin-right')) || 20,
            b: parseInt(root.style.getPropertyValue('--paper-margin-bottom')) || 20,
            l: parseInt(root.style.getPropertyValue('--paper-margin-left')) || 30
        };
        
        // If specific page override exists, use it
        if (pageOverrides[pageNum]) return pageOverrides[pageNum];
        
        // If current page is being edited in 'current' mode, use current input values
        if (marginScope.value === 'current' && parseInt(targetPageSelect.value) === pageNum) {
            return {
                t: parseInt(marginTopInput.value) || global.t,
                r: parseInt(marginRightInput.value) || global.r,
                b: parseInt(marginBottomInput.value) || global.b,
                l: parseInt(marginLeftInput.value) || global.l
            };
        }
        
        return global;
    }

    const pageWidthPx = dim.width * pxPerMm;
    const pageHeightPx = dim.height * pxPerMm;

    if (isMobile && window.visualViewport) {
        const currentVHeight = window.visualViewport.height;
        if (Math.abs((window.lastVHeight || currentVHeight) - currentVHeight) > 150) {
            window.lastVHeight = currentVHeight;
            return Promise.resolve();
        }
        window.lastVHeight = currentVHeight;
    }

    const lineH = parseInt(lineSpacingSlider.value) || 34;
    document.documentElement.style.setProperty('--ruled-line-spacing', `${lineH}px`);

    const realism = getRealism();
    const inkVar = getInkVariation();
    const headerHTML = getHeaderHTML();
    const titleHTML = getTitleHTML();

    measureContainer.style.fontFamily = fontFamilySelect.value;
    measureContainer.style.fontSize = `${fontSizeInput.value}px`;
    measureContainer.style.lineHeight = `${lineH}px`;
    measureContainer.style.letterSpacing = `${letterSpacingSlider.value}px`;
    if (wordSpacingSlider) measureContainer.style.wordSpacing = `${wordSpacingSlider.value}px`;

    measureContainer.innerHTML = `
        <style>
            .resetted { width: 100%; margin: 0 !important; padding: 0 !important; line-height: inherit; word-break: break-word; overflow-wrap: anywhere; }
            .resetted p, .resetted div, .resetted h1, .resetted h2, .resetted h3, .resetted ul, .resetted ol, .resetted li { margin: 0 !important; padding: 0 !important; line-height: inherit; }
            .resetted table { width: 100%; border-collapse: collapse; margin: 12px 0 !important; font-size: 0.88em; line-height: inherit; filter: url('#hand-drawn-filter'); }
            .resetted th, .resetted td { border: 1.2px solid currentColor; padding: 8px 12px !important; text-align: left; vertical-align: top; box-sizing: border-box; }
            </style>
            <div id="measure-wrap" class="resetted"></div>
            `;
            const mWrap = measureContainer.querySelector('#measure-wrap');

            let headerH = 0; let titleH = 0;
            if (headerHTML || titleHTML) {
            if (headerHTML) { mWrap.innerHTML = headerHTML; headerH = mWrap.offsetHeight; }
            if (titleHTML) { mWrap.innerHTML = titleHTML; titleH = mWrap.offsetHeight; }
            }
            mWrap.innerHTML = ''; 

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // EXPERT: Check if the editor content already has a synced header/title
            // If it does, we disable the auto-header for the first page to avoid duplication.
            const hasInternalHeader = !!tempDiv.querySelector('[id*="sync-"]');

            const inputBlocks = [];
            const flatten = (node) => {
            const isGeneric = node.nodeType === 1 && (node.tagName === 'DIV' || node.tagName === 'SECTION' || node.tagName === 'P');
            const hasSplittableChild = node.nodeType === 1 && node.querySelector('table, ul, ol, img');
            if (isGeneric && hasSplittableChild && !node.classList.contains('no-hw')) {
            Array.from(node.childNodes).forEach(flatten);
            } else if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'DIV') && node.textContent.length > 800) {
            const text = node.innerHTML;
            const chunks = text.split(/(?<=[.!?])\s+/);
            let currentChunk = '';
            chunks.forEach(sentence => {
                if ((currentChunk + sentence).length > 800) {
                    const p = node.cloneNode(false); p.innerHTML = currentChunk; p.classList.add('micro-chunk');
                    inputBlocks.push(p); currentChunk = sentence;
                } else { currentChunk += (currentChunk ? ' ' : '') + sentence; }
            });
            if (currentChunk) {
                const p = node.cloneNode(false); p.innerHTML = currentChunk; p.classList.add('micro-chunk');
                inputBlocks.push(p);
            }
            } else { inputBlocks.push(node); }
            };
            Array.from(tempDiv.childNodes).forEach(flatten);

            // FLICKER PREVENTION: Don't clear immediately. Show loader ONLY if it takes > 250ms (800ms on mobile).
            const loaderTimer = setTimeout(() => {
            if (taskId === renderTaskId) {
            pagesContainer.innerHTML = `<div style="text-align:center;padding:100px;font-family:'Inter', sans-serif;color:#a0aec0;opacity:0.75;animation:pulse 1.5s infinite">
                <span class="material-icons-round" style="font-size:48px;display:block;margin-bottom:15px">auto_awesome</span>
                Preparing assignment layout...
            </div>`;
            }
            }, isMobile ? 800 : 250);

            const fragment = document.createDocumentFragment();
            let pageCount = 0;
            let contentArea = null;
            let usedH = 0;
            let limitH = 0;
            let processedHTMLArr = [];

            const addPage = () => {
            pageCount++;
            const m = getMarginsForPageMm(pageCount);
            const mtPx = m.t * pxPerMm;
            const mbPx = m.b * pxPerMm;
            const mlPx = m.l * pxPerMm;
            const mrPx = m.r * pxPerMm;

            const page = createPageElement(pageCount, 1);
            fragment.appendChild(page);
            contentArea = page.querySelector('.inner-container');

            if (pageCount === 1) {
            // EXPERT: Skip auto-header if content already has its own synced header
            if (titleHTML && !hasInternalHeader) {
                const t = document.createElement('div'); t.className='assignment-header-area'; t.innerHTML=titleHTML;
                contentArea.appendChild(t); usedH = t.getBoundingClientRect().height;
            } else { usedH = 0; }
            } else if (showHeaderEveryPage.checked && headerHTML) {
            const h = document.createElement('div'); h.className='header-repeat-area'; h.innerHTML=headerHTML;
            contentArea.appendChild(h); usedH = h.getBoundingClientRect().height;
            } else { usedH = 0; }

            limitH = Math.floor(pageHeightPx - mtPx - mbPx);
            measureContainer.style.width = `${pageWidthPx - mlPx - mrPx}px`;
            };

            addPage();
            const queue = [...inputBlocks];

            let finalizePromiseResolver = null;
            const finalizePromise = new Promise(resolve => {
            finalizePromiseResolver = resolve;
            });

            const processChunk = () => {
            if (taskId !== renderTaskId) return;
            const startTime = performance.now();
            const MAX_FRAME_MS = isMobile ? 12 : 18;

            while (queue.length > 0 && (performance.now() - startTime < MAX_FRAME_MS)) {
            let node = queue.shift();
            let block;
            if (node.nodeType === 3) {
                if (!node.textContent.trim()) continue;
                block = document.createElement('span'); block.textContent = node.textContent;
            } else if (node.nodeType === 1) { block = node.cloneNode(true); } else continue;

            mWrap.innerHTML = '';
            let mBlock = block.cloneNode(true);
            if ((realism > 0 || inkVar > 0) && mBlock.nodeType === 1 && mBlock.tagName !== 'IMG' && !mBlock.classList.contains('no-hw')) {
                applyHandwritingToNode(mBlock);
            }
            mWrap.appendChild(mBlock);
            let bH = mWrap.getBoundingClientRect().height;

            if (usedH + bH > limitH + 0.5) {
                // LOOP SAFETY: If we already have a new page and the block is still too big, 
                // we must force it or we will loop forever.
                const isNewPage = (usedH < 5); 

                if (block.tagName === 'TABLE') {
                    // EXPERT: Capture column widths before splitting so they align perfectly across pages
                    mWrap.innerHTML = '';
                    const measureTable = block.cloneNode(true);
                    measureTable.style.width = '100%';
                    measureTable.style.tableLayout = 'auto'; // Let browser calculate natural widths
                    mWrap.appendChild(measureTable);
                    
                    const colPercents = [];
                    if (mWrap.firstChild && mWrap.firstChild.rows.length > 0) {
                        const firstRow = mWrap.firstChild.rows[0];
                        const totalW = mWrap.firstChild.getBoundingClientRect().width;
                        if (totalW > 0) {
                            Array.from(firstRow.cells).forEach(c => {
                                colPercents.push((c.getBoundingClientRect().width / totalW) * 100);
                            });
                        }
                    }

                    const allRows = Array.from(block.querySelectorAll('tr'));
                    const thead = block.querySelector('thead');
                    const hasThead = !!thead;
                    const headerRows = hasThead ? Array.from(thead.querySelectorAll('tr')) : [];
                    const dataRows = allRows.filter(r => !headerRows.includes(r));

                    const isContinuation = block.classList.contains('table-continuation');

                    if (dataRows.length > 1) {
                        // Table Part 1: Current Page
                        const t1 = block.cloneNode(false);
                        if (hasThead && !isContinuation) {
                            t1.appendChild(thead.cloneNode(true));
                        }
                        const b1 = document.createElement('tbody');
                        b1.appendChild(dataRows[0].cloneNode(true));
                        t1.appendChild(b1);
                        t1.classList.add('table-split-bottom');

                        // Table Part 2: Continuation (Queue)
                        const t2 = block.cloneNode(false);
                        t2.classList.add('table-continuation', 'table-split-top');
                        
                        const b2 = document.createElement('tbody');
                        dataRows.slice(1).forEach(r => b2.appendChild(r.cloneNode(true)));
                        t2.appendChild(b2);

                        if (hasThead) t2.setAttribute('data-needs-header', 'true');

                        // Apply the captured widths to ensure perfect vertical line alignment
                        const applyWidths = (t) => {
                            t.style.tableLayout = 'fixed';
                            t.style.width = '100%';
                            if (colPercents.length > 0) {
                                // Apply to the first row of the table (could be thead or tbody)
                                const targetRow = t.rows[0];
                                if (targetRow) {
                                    Array.from(targetRow.cells).forEach((c, i) => {
                                        if (colPercents[i]) {
                                            c.style.width = `${colPercents[i]}%`;
                                            c.style.minWidth = `${colPercents[i]}%`;
                                            c.style.maxWidth = `${colPercents[i]}%`;
                                        }
                                    });
                                }
                            }
                        };
                        
                        applyWidths(t1);
                        applyWidths(t2);

                        queue.unshift(t1, t2);
                        continue;
                    }
                }
                if (block.tagName === 'UL' || block.tagName === 'OL') {
                    const items = Array.from(block.querySelectorAll('li'));
                    if (items.length > 1) {
                        const l1 = block.cloneNode(false); l1.appendChild(items[0]);
                        const l2 = block.cloneNode(false); items.slice(1).forEach(i => l2.appendChild(i));
                        queue.unshift(l1, l2); continue;
                    }
                }
                if (block.nodeType === 1 && (block.tagName === 'DIV' || block.tagName === 'P' || block.tagName === 'SECTION')) {
                    const children = Array.from(block.childNodes);
                    if (children.length > 1) {
                        children.reverse().forEach(c => {
                            if (c.nodeType === 3 && !c.textContent.trim()) return;
                            const wrapper = block.cloneNode(false); wrapper.appendChild(c.cloneNode(true));
                            queue.unshift(wrapper);
                        });
                        continue;
                    }
                }

                // Atomized word split fallback
                const pTop = block.cloneNode(false);
                const cNodes = Array.from(block.childNodes);
                let space = limitH - usedH;
                let addedThisPage = 0;
                while(cNodes.length > 0) {
                    const c = cNodes[0];
                    mWrap.innerHTML = '';
                    const mP = block.cloneNode(false); mP.appendChild(c.cloneNode(true));
                    if ((realism > 0 || inkVar > 0) && mP.innerHTML.trim() !== '') applyHandwritingToNode(mP);
                    mWrap.appendChild(mP);
                    const cH = mWrap.getBoundingClientRect().height;
                    if (space >= cH - 2.0) {
                        pTop.appendChild(cNodes.shift()); space -= cH; addedThisPage++;
                    } else if (c.nodeType === 3) {
                        const words = c.textContent.split(/(\s+)/);
                        let curText = ''; let fCount = 0;
                        for (let i = 0; i < words.length; i++) {
                            mWrap.innerHTML = '';
                            const mP_w = block.cloneNode(false); mP_w.textContent = curText + words[i];
                            if (realism > 0 || inkVar > 0) applyHandwritingToNode(mP_w);
                            mWrap.appendChild(mP_w);
                            if (space >= mWrap.getBoundingClientRect().height - 2.0) {
                                curText += words[i]; fCount++;
                            } else break;
                        }
                        if (fCount > 0) {
                            pTop.appendChild(document.createTextNode(curText));
                            cNodes[0] = document.createTextNode(words.slice(fCount).join(''));
                            addedThisPage++;
                        }
                        break;
                    } else break;
                }

                if (addedThisPage > 0) {
                    const final = pTop.cloneNode(true);
                    if (realism > 0 || inkVar > 0) applyHandwritingToNode(final);
                    contentArea.appendChild(final);
                    processedHTMLArr.push(final.outerHTML);
                    usedH += final.getBoundingClientRect().height;
                    if (cNodes.length > 0) {
                        const pRest = block.cloneNode(false);
                        cNodes.forEach(c => pRest.appendChild(c));
                        queue.unshift(pRest);
                    }
                } else {
                    // If it's a new page and even a single word doesn't fit, we force it anyway to prevent infinite loop
                    if (isNewPage) {
                        contentArea.appendChild(mBlock);
                        processedHTMLArr.push(mBlock.outerHTML);
                        usedH += bH;
                    } else {
                        addPage();
                        queue.unshift(block);
                    }
                }
            } else {
                contentArea.appendChild(mBlock);
                processedHTMLArr.push(mBlock.outerHTML);
                usedH += bH;
            }
        }

        if (queue.length > 0) {
            requestAnimationFrame(processChunk);
        } else {
            finalizeRender();
        }
    };

    const finalizeRender = () => {
        if (taskId !== renderTaskId) return;
        clearTimeout(loaderTimer);
        pagesContainer.innerHTML = '';
        pagesContainer.appendChild(fragment);

        // Restore scroll position
        if (restoredScrollTop > 0 && scrollContainer) {
            scrollContainer.scrollTop = restoredScrollTop;
            restoredScrollTop = 0; // Reset for next interaction
        }

        pageObserver.disconnect();
        pagesContainer.querySelectorAll('.paper').forEach(p => pageObserver.observe(p));
        totalPages = pagesContainer.querySelectorAll('.paper').length;
        pagesContainer.querySelectorAll('.paper').forEach((p, i) => {
            const n = p.querySelector('.page-number');
            if (n) {
                const text = `Page ${i + 1} of ${totalPages}`;
                n.innerHTML = applyHandwritingEffect(text);
            }
        });
        currentContentHTML = processedHTMLArr.join('') || (plainText.trim() ? '' : '<span class="placeholder-text">Start typing... ✍️</span>');
        updateStats();
        if (finalizePromiseResolver) finalizePromiseResolver();
    };

    processChunk();
    return finalizePromise;
}
    function debouncedRender() {
        clearTimeout(renderTimer);
        renderTimer = setTimeout(() => {
            const content = richEditor.innerHTML;
            const cleaned = content.replace(/(<p><br><\/p>|<br>)+$/gi, '');
            if (cleaned !== content && cleaned.trim() !== '') {
                richEditor.innerHTML = cleaned;
            }
            
            renderContent();
            triggerAutosave();
        }, 300);
    }

    richEditor.addEventListener('input', debouncedRender);

    // ───────────────────────────────────────────
    // SETTINGS: Font Family
    // ───────────────────────────────────────────
    fontFamilySelect.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // SETTINGS: Font Size
    // ───────────────────────────────────────────
    fontSizeInput.addEventListener('input', (e) => {
        fontSizeVal.textContent = `${e.target.value}px`;
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // SETTINGS: Line Spacing
    // ───────────────────────────────────────────
    lineSpacingSlider.addEventListener('input', (e) => {
        lineSpacingVal.textContent = `${e.target.value}px`;
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // SETTINGS: Letter Spacing
    // ───────────────────────────────────────────
    letterSpacingSlider.addEventListener('input', (e) => {
        letterSpacingVal.textContent = `${e.target.value}px`;
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // SETTINGS: Word Spacing
    // ───────────────────────────────────────────
    if (wordSpacingSlider) {
        wordSpacingSlider.addEventListener('input', (e) => {
            wordSpacingVal.textContent = `${e.target.value}px`;
            renderContent();
            triggerAutosave();
        });
    }

    // ───────────────────────────────────────────
    // CUSTOM FONT UPLOAD
    // ───────────────────────────────────────────
    if (customFontBtn && customFontInput) {
        customFontBtn.addEventListener('click', () => {
            customFontInput.click();
        });

        customFontInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                customFontUrl = ev.target.result;
                const fontName = 'CustomFont_' + Date.now();
                const fontStyle = document.createElement('style');
                fontStyle.textContent = `@font-face { font-family: '${fontName}'; src: url('${customFontUrl}'); }`;
                document.head.appendChild(fontStyle);

                // Add to select
                const opt = document.createElement('option');
                opt.value = `'${fontName}', sans-serif`;
                opt.textContent = `Custom: ${file.name.substring(0, 15)}...`;
                fontFamilySelect.appendChild(opt);
                fontFamilySelect.value = opt.value;

                showToast('Custom handwriting font loaded!', 'success');
                renderContent();
                triggerAutosave();
            };
            reader.readAsDataURL(file);
        });
    }

    // ───────────────────────────────────────────
    // SETTINGS: Ink Color
    // ───────────────────────────────────────────
    function setInkColor(color, isCustom = false) {
        currentInkColor = color;
        colorBtns.forEach(b => {
            b.classList.remove('active');
            if (!isCustom && b.getAttribute('data-color') === color) {
                b.classList.add('active');
            }
        });

        const customBtn = document.querySelector('.color-btn-custom');
        if (isCustom) {
            customBtn.classList.add('active');
            customBtn.style.backgroundColor = color;
            customBtn.querySelector('.material-icons-round').style.color = '#fff';
            customColorInput.value = color;
            if (customHexInput) {
                customHexInput.value = color.replace('#', '').toUpperCase();
            }
        } else {
            customBtn.style.backgroundColor = '';
            customBtn.querySelector('.material-icons-round').style.color = '';
            if (customHexInput) {
                customHexInput.value = color.replace('#', '').toUpperCase();
            }
        }

        renderContent();
        triggerAutosave();
    }

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            if (color === 'custom') {
                customColorInput.click();
                return;
            }
            setInkColor(color, false);
        });
    });

    ['input', 'change'].forEach(evt => {
        customColorInput.addEventListener(evt, (e) => {
            setInkColor(e.target.value, true);
        });
    });

    if (customHexInput) {
        customHexInput.addEventListener('input', (e) => {
            let hex = e.target.value.trim();
            if (hex.startsWith('#')) hex = hex.substring(1);
            
            // Validate if it's a valid hex
            if (/^[0-9A-Fa-f]{3,6}$/.test(hex)) {
                if (hex.length === 3 || hex.length === 6) {
                    const fullHex = '#' + hex;
                    setInkColor(fullHex, true);
                }
            }
        });
    }

    // ───────────────────────────────────────────
    // SETTINGS: Paper Style & Custom Background Upload
    // ───────────────────────────────────────────
    paperStyleSelect.addEventListener('change', () => {
        if (paperStyleSelect.value === 'custom') {
            customPaperBtn.style.display = 'flex';
        } else {
            customPaperBtn.style.display = 'none';
        }
        renderContent();
        triggerAutosave();
    });

    if (customPaperBtn && customPaperInput) {
        customPaperBtn.addEventListener('click', () => {
            customPaperInput.click();
        });

        customPaperInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                customPaperUrl = ev.target.result;
                showToast('Custom paper background loaded!', 'success');
                renderContent();
                triggerAutosave();
            };
            reader.readAsDataURL(file);
        });
    }

    // (Print handler is defined below after zoom controls)

    // ───────────────────────────────────────────
    // SETTINGS: Realism & Ink Variation
    // ───────────────────────────────────────────
    realismSlider.addEventListener('input', () => {
        updateSettingsCache();
        renderContent();
        triggerAutosave();
    });

    inkVariationSlider.addEventListener('input', () => {
        updateSettingsCache();
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // SETTINGS: Smudges
    // ───────────────────────────────────────────
    enableSmudgesCheck.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    function generateSmudgesInto(container) {
        const count = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
            const smudge = document.createElement('div');
            smudge.className = 'ink-smudge';
            const size = 25 + Math.random() * 70;
            smudge.style.width = `${size}px`;
            smudge.style.height = `${size * (0.4 + Math.random() * 0.6)}px`;
            smudge.style.top = `${10 + Math.random() * 80}%`;
            smudge.style.left = `${5 + Math.random() * 85}%`;
            smudge.style.transform = `rotate(${Math.random() * 360}deg)`;
            smudge.style.opacity = 0.25 + Math.random() * 0.4;
            container.appendChild(smudge);
        }
    }

    // ───────────────────────────────────────────
    // SETTINGS: Paper Texture, Stain, Doodle, Scanner Fx
    // ───────────────────────────────────────────
    enableTextureCheck.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    enableStainCheck.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    enableDoodleCheck.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    enableScannerFxCheck.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    if (enableVintageCheck) {
        enableVintageCheck.addEventListener('change', () => {
            renderContent();
            triggerAutosave();
        });
    }

    // Page numbers & header repeat
    showPageNumbers.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    showHeaderEveryPage.addEventListener('change', () => {
        renderContent();
        triggerAutosave();
    });

    // ───────────────────────────────────────────
    // ZOOM CONTROLS
    // ───────────────────────────────────────────
    function setZoom(level) {
        currentZoom = Math.max(0.2, Math.min(1.5, level));
        // Use standard CSS transform to guarantee cross-browser compatibility and exact mobile touch coordinates
        paperWrapper.style.zoom = 'normal';
        paperWrapper.style.transform = `scale(${currentZoom})`;
        paperWrapper.style.transformOrigin = 'top center';
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    let isAutoFit = true;

    zoomInBtn.addEventListener('click', () => { isAutoFit = false; setZoom(currentZoom + 0.1); });
    zoomOutBtn.addEventListener('click', () => { isAutoFit = false; setZoom(currentZoom - 0.1); });
    zoomFitBtn.addEventListener('click', () => {
        isAutoFit = true;
        const container = document.getElementById('paper-scroll-container');
        const containerWidth = container.clientWidth - (window.innerWidth <= 900 ? 20 : 60);
        const dim = getPageDimensions();
        const paperPx = dim.width * 3.78;
        const fitZoom = Math.min(containerWidth / paperPx, 1);
        setZoom(fitZoom);
    });

    function autoFitZoom() {
        if (!isAutoFit) return;
        const container = document.getElementById('paper-scroll-container');
        if (!container) return;
        const containerWidth = container.clientWidth - (window.innerWidth <= 900 ? 30 : 80);
        const dim = getPageDimensions();
        const paperPx = dim.width * 3.78; 
        let fitZoom = containerWidth / paperPx;
        
        // On mobile, never exceed 100% and always try to see the full page width
        if (isMobile) {
            fitZoom = Math.min(fitZoom, 0.95);
        } else {
            fitZoom = Math.min(fitZoom, 1.2);
        }
        setZoom(fitZoom);
    }

    // Auto-adjust scale on resize for responsive design
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            autoFitZoom();
        }, 150);
    });

    // ───────────────────────────────────────────
    // ACTIONS: Print (single, consolidated handler)
    // ───────────────────────────────────────────
    async function handlePrint() {
        if (isPrinting) return;
        isPrinting = true;
        showToast('Preparing high-fidelity assignment... 📄', 'info', 4000);
        
        const originalZoom = currentZoom;
        setZoom(1);
        
        // Wait for rendering to actually finish instead of using a guess/timer
        await renderContent();
        
        // Ensure all pages are visible for printing (bypass virtualization)
        pagesContainer.querySelectorAll('.inner-container').forEach(inner => {
            inner.style.visibility = 'visible';
            inner.style.opacity = '1';
        });

        updateMargins();
        updatePrintPageSize();

        await Promise.all([
            document.fonts.ready,
            ...Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(r => img.onload = img.onerror = r))
        ]);

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                isPrinting = false;
                setZoom(originalZoom);
                renderContent();
                showToast('Assignment generated! ✨', 'success');
            }, 1000);
        }, 1000);
    }

    printBtn.addEventListener('click', handlePrint);

    // ───────────────────────────────────────────
    // ACTIONS: Download as Image
    // ───────────────────────────────────────────
    async function handleDownloadImage() {
        if (typeof html2canvas === 'undefined') {
            showToast('Export library not loaded. Please refresh.', 'error');
            return;
        }

        const pageElements = Array.from(pagesContainer.querySelectorAll('.paper'));
        if (pageElements.length === 0) {
            showToast('Nothing to export!', 'warning');
            return;
        }

        showToast(`Preparing ${pageElements.length} pages... 🚀`, 'info', 2000);
        
        try {
            // Expert: Use a very specific scale to avoid memory limits while maintaining sharpness
            const scale = isMobile ? 1.4 : 2;
            const generatedFiles = [];
            
            // Expert: Sequentially process each page to ensure UI stays responsive and memory low
            for (let i = 0; i < pageElements.length; i++) {
                showToast(`Capturing Page ${i + 1} of ${pageElements.length}...`, 'info', 1500);
                
                const sourcePage = pageElements[i];
                const inner = sourcePage.querySelector('.inner-container');
                
                // Force visibility for capture
                if (inner) {
                    inner.style.visibility = 'visible';
                    inner.style.opacity = '1';
                }

                // Expert Capture Config: Forced dimensions and isolated styles via onclone
                const canvas = await html2canvas(sourcePage, {
                    scale: scale,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: sourcePage.offsetWidth,
                    height: sourcePage.offsetHeight,
                    onclone: (clonedDoc) => {
                        const target = clonedDoc.querySelectorAll('.paper')[i];
                        if (target) {
                            // Expert: Remove all effects that interfere with high-res capture
                            target.style.boxShadow = 'none';
                            target.style.margin = '0';
                            target.style.transform = 'none';
                            target.style.transition = 'none';
                            // Ensure the inner container is fully expanded
                            const clonedInner = target.querySelector('.inner-container');
                            if (clonedInner) clonedInner.style.visibility = 'visible';
                        }
                    }
                });

                await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            generatedFiles.push({ 
                                blob, 
                                fileName: `assignment_p${i + 1}_${Date.now()}.png` 
                            });
                        }
                        resolve();
                    }, 'image/png', 0.92); // Slight compression to save mobile bandwidth
                });

                // Small delay to allow browser to breath/GC
                await new Promise(r => setTimeout(r, 200));
            }

            if (isMobile) {
                const overlay = document.createElement('div');
                overlay.className = 'mobile-export-overlay';
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(10, 15, 30, 0.98); z-index: 10000;
                    display: flex; flex-direction: column; overflow-y: auto;
                    padding: 20px; box-sizing: border-box;
                `;

                const header = document.createElement('div');
                header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';
                header.innerHTML = `
                    <div style="color: white">
                        <h4 style="margin:0">Export Ready</h4>
                        <p style="margin:5px 0 0; font-size:12px; color:#aaa">Long-press to save each page</p>
                    </div>
                    <button id="close-export" style="background:#ff4757; color:white; border:none; padding:8px 15px; border-radius:20px; font-weight:bold; cursor:pointer">Done</button>
                `;
                overlay.appendChild(header);

                const blobUrls = [];
                generatedFiles.forEach((file) => {
                    const url = URL.createObjectURL(file.blob);
                    blobUrls.push(url);
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.cssText = 'width: 100%; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
                    overlay.appendChild(img);
                });

                document.body.appendChild(overlay);
                overlay.querySelector('#close-export').onclick = () => {
                    // Memory Cleanup: Revoke all URLs when done
                    blobUrls.forEach(url => URL.revokeObjectURL(url));
                    overlay.remove();
                };
                showToast(`Success! ${pageElements.length} page(s) ready.`, 'success');
            } else {
                for (let i = 0; i < generatedFiles.length; i++) {
                    const { blob, fileName } = generatedFiles[i];
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    await new Promise(r => setTimeout(r, 400));
                    URL.revokeObjectURL(url);
                }
                showToast(`Successfully downloaded ${pageElements.length} page(s)! 🎉`, 'success');
            }
        } catch (err) {
            console.error('Download failed:', err);
            showToast('Image processing failed. Try "Print" for PDF instead.', 'error');
        }
    }

    downloadImgBtn.addEventListener('click', handleDownloadImage);

    // ───────────────────────────────────────────
    // ACTIONS: Copy as Image
    // ───────────────────────────────────────────
    copyBtn.addEventListener('click', async () => {
        try {
            const firstPage = pagesContainer.querySelector('.paper');
            if (!firstPage) {
                showToast('Nothing to copy yet!', 'warning');
                return;
            }

            if (typeof html2canvas === 'undefined') {
                showToast('Export library not loaded.', 'error');
                return;
            }

            showToast('Copying page... 📋', 'info', 2000);

            const canvas = await html2canvas(firstPage, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#ffffff' 
            });

            canvas.toBlob(async (blob) => {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    showToast('First page copied as image! 📋', 'success');
                } catch (err) {
                    // Fallback to text copy if image copy fails (some browsers restricts Image Clipboard)
                    const text = richEditor.textContent;
                    await navigator.clipboard.writeText(text);
                    showToast('Copied content as text! 📋', 'success');
                }
            }, 'image/png');
        } catch (err) {
            showToast('Copy failed.', 'error');
            console.error(err);
        }
    });

    // ───────────────────────────────────────────
    // ACTIONS: Fullscreen
    // ───────────────────────────────────────────
    fullscreenBtn.addEventListener('click', () => {
        const preview = document.getElementById('preview-area');
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            const request = preview.requestFullscreen || preview.webkitRequestFullscreen || preview.msRequestFullscreen;
            if (request) {
                request.call(preview).catch(err => {
                    showToast('Fullscreen denied by browser', 'warning');
                });
            } else {
                showToast('Fullscreen not supported in this browser', 'warning');
            }
        } else {
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
            if (exit) exit.call(document);
        }
    });

    // ───────────────────────────────────────────
    // MOBILE ACTION BAR BUTTONS
    // ───────────────────────────────────────────
    const mobilePrintBtn = document.getElementById('mobile-print-btn');
    const mobileDownloadBtn = document.getElementById('mobile-download-btn');
    const mobileFullscreenBtn = document.getElementById('mobile-fullscreen-btn');

    if (mobilePrintBtn) {
        mobilePrintBtn.addEventListener('click', handlePrint);
    }

    if (mobileDownloadBtn) {
        mobileDownloadBtn.addEventListener('click', handleDownloadImage);
    }

    if (mobileFullscreenBtn) {
        mobileFullscreenBtn.addEventListener('click', () => {
            fullscreenBtn.click();
        });
    }

    // ───────────────────────────────────────────
    // ACTIONS: Clear
    // ───────────────────────────────────────────
    clearBtn.addEventListener('click', () => {
        if (!confirm('Clear all content and settings? This cannot be undone.')) return;

        nameInput.value = '';
        rollInput.value = '';
        classInput.value = '';
        dateInput.value = '';
        subjectInput.value = '';
        professorInput.value = '';
        titleInput.value = '';
        richEditor.innerHTML = '';

        // Reset customizations
        setInkColor(colorBtns[0].getAttribute('data-color'), false);
        fontFamilySelect.value = "'Kalam', cursive";
        fontSizeInput.value = 22;
        fontSizeVal.textContent = '22px';
        lineSpacingSlider.value = 38;
        lineSpacingVal.textContent = '38px';
        letterSpacingSlider.value = 0;
        letterSpacingVal.textContent = '0px';
        if (wordSpacingSlider) {
            wordSpacingSlider.value = 0;
            wordSpacingVal.textContent = '0px';
        }
        realismSlider.value = 60;
        inkVariationSlider.value = 40;

        paperStyleSelect.value = 'ruled';
        if (customPaperBtn) customPaperBtn.style.display = 'none';
        customPaperUrl = null;
        if (customPaperInput) customPaperInput.value = '';
        if (customFontInput) customFontInput.value = '';
        if (customHexInput) customHexInput.value = '';
        pageSizeSelect.value = 'A4';
        currentOrientation = 'portrait';
        orientBtns.forEach(b => b.classList.remove('active'));
        orientBtns[0].classList.add('active');

        // FIX: Match HTML default values (T=35, R=20, B=20, L=30)
        marginTopInput.value = 35;
        marginRightInput.value = 20;
        marginBottomInput.value = 20;
        marginLeftInput.value = 30;

        enableSmudgesCheck.checked = false;
        enableTextureCheck.checked = true;
        enableStainCheck.checked = false;
        enableDoodleCheck.checked = false;
        if (enableScannerFxCheck) enableScannerFxCheck.checked = false;
        if (enableVintageCheck) enableVintageCheck.checked = false;
        showPageNumbers.checked = true;
        showHeaderEveryPage.checked = false;

        updatePageSize();
        updateMargins();
        renderContent();

        localStorage.removeItem('notebookgen_data');
        showToast('Everything cleared', 'info');
    });

    // ───────────────────────────────────────────
    // AUTO-SAVE / RESTORE
    // ───────────────────────────────────────────
    function triggerAutosave() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(saveToLocalStorage, 1000);
    }

    function saveToLocalStorage() {
        const data = {
            name: nameInput.value,
            roll: rollInput.value,
            class: classInput.value,
            date: dateInput.value,
            subject: subjectInput.value,
            professor: professorInput.value,
            title: titleInput.value,
            content: richEditor.innerHTML,
            fontFamily: fontFamilySelect.value,
            fontSize: fontSizeInput.value,
            inkColor: currentInkColor,
            paperStyle: paperStyleSelect.value,
            pageSize: pageSizeSelect.value,
            orientation: currentOrientation,
            marginTop: marginTopInput.value,
            marginRight: marginRightInput.value,
            marginBottom: marginBottomInput.value,
            marginLeft: marginLeftInput.value,
            realism: realismSlider.value,
            inkVariation: inkVariationSlider.value,
            lineSpacing: lineSpacingSlider.value,
            letterSpacing: letterSpacingSlider.value,
            wordSpacing: wordSpacingSlider ? wordSpacingSlider.value : 0,
            smudges: enableSmudgesCheck.checked,
            texture: enableTextureCheck.checked,
            stain: enableStainCheck.checked,
            doodle: enableDoodleCheck.checked,
            scannerFx: enableScannerFxCheck ? enableScannerFxCheck.checked : false,
            vintage: enableVintageCheck ? enableVintageCheck.checked : false,
            pageNumbers: showPageNumbers.checked,
            headerEveryPage: showHeaderEveryPage.checked,
            // FIX: Save expert formatting properties
            ruledLineColor: ruledLineColorPicker ? ruledLineColorPicker.value : '#c2ddf0',
            marginLineColor: marginLineColorPicker ? marginLineColorPicker.value : '#ef9090',
            paperColor: paperColorPicker ? paperColorPicker.value : '#fefdfb',
            lineOpacity: lineOpacitySlider ? lineOpacitySlider.value : 70,
            lineNudge: lineNudgeInput ? lineNudgeInput.value : 0,
            pageNumberPos: pageNumberPos ? pageNumberPos.value : 'center',
            scrollPos: scrollContainer.scrollTop,
        };
        try {
            localStorage.setItem('notebookgen_data', JSON.stringify(data));
            if (autosaveBadge) {
                autosaveBadge.classList.add('visible');
                setTimeout(() => autosaveBadge.classList.remove('visible'), 2000);
            }
        } catch (e) {
            console.warn('Auto-save failed:', e);
        }
    }

    function restoreFromLocalStorage() {
        try {
            const raw = localStorage.getItem('notebookgen_data');
            if (!raw) return false;
            const data = JSON.parse(raw);

            nameInput.value = data.name || '';
            rollInput.value = data.roll || '';
            classInput.value = data.class || '';
            dateInput.value = data.date || '';
            subjectInput.value = data.subject || '';
            professorInput.value = data.professor || '';
            titleInput.value = data.title || '';
            richEditor.innerHTML = data.content || '';

            if (data.fontFamily) fontFamilySelect.value = data.fontFamily;
            if (data.fontSize) {
                fontSizeInput.value = data.fontSize;
                fontSizeVal.textContent = `${data.fontSize}px`;
            }
            if (data.inkColor) {
                const isCustom = !Array.from(colorBtns).some(b => b.getAttribute('data-color') === data.inkColor && b.getAttribute('data-color') !== 'custom');
                setInkColor(data.inkColor, isCustom);
            }
            if (data.paperStyle) {
                paperStyleSelect.value = data.paperStyle;
                if (data.paperStyle === 'custom') {
                    customPaperBtn.style.display = 'flex';
                }
            }
            if (data.pageSize) pageSizeSelect.value = data.pageSize;
            if (data.orientation) {
                currentOrientation = data.orientation;
                orientBtns.forEach(b => {
                    b.classList.remove('active');
                    if (b.getAttribute('data-orient') === data.orientation) b.classList.add('active');
                });
            }
            // FIX: Use != null check so margin values of 0 are correctly restored
            if (data.marginTop != null) marginTopInput.value = data.marginTop;
            if (data.marginRight != null) marginRightInput.value = data.marginRight;
            if (data.marginBottom != null) marginBottomInput.value = data.marginBottom;
            if (data.marginLeft != null) marginLeftInput.value = data.marginLeft;
            if (data.realism) realismSlider.value = data.realism;
            if (data.inkVariation) inkVariationSlider.value = data.inkVariation;
            if (data.lineSpacing) {
                lineSpacingSlider.value = data.lineSpacing;
                lineSpacingVal.textContent = `${data.lineSpacing}px`;
            }
            if (data.letterSpacing != null) {
                letterSpacingSlider.value = data.letterSpacing;
                letterSpacingVal.textContent = `${data.letterSpacing}px`;
            }
            if (data.wordSpacing != null && wordSpacingSlider) {
                wordSpacingSlider.value = data.wordSpacing;
                wordSpacingVal.textContent = `${data.wordSpacing}px`;
            }
            if (typeof data.smudges === 'boolean') enableSmudgesCheck.checked = data.smudges;
            if (typeof data.texture === 'boolean') enableTextureCheck.checked = data.texture;
            if (typeof data.stain === 'boolean') enableStainCheck.checked = data.stain;
            if (typeof data.doodle === 'boolean') enableDoodleCheck.checked = data.doodle;
            if (typeof data.scannerFx === 'boolean' && enableScannerFxCheck) enableScannerFxCheck.checked = data.scannerFx;
            if (typeof data.vintage === 'boolean' && enableVintageCheck) enableVintageCheck.checked = data.vintage;
            if (typeof data.pageNumbers === 'boolean') showPageNumbers.checked = data.pageNumbers;
            if (typeof data.headerEveryPage === 'boolean') showHeaderEveryPage.checked = data.headerEveryPage;

            // FIX: Restore expert formatting properties
            if (data.ruledLineColor && ruledLineColorPicker) {
                ruledLineColorPicker.value = data.ruledLineColor;
                document.documentElement.style.setProperty('--ruled-line-color', data.ruledLineColor);
            }
            if (data.marginLineColor && marginLineColorPicker) {
                marginLineColorPicker.value = data.marginLineColor;
                document.documentElement.style.setProperty('--margin-line-color', data.marginLineColor);
            }
            if (data.paperColor && paperColorPicker) {
                paperColorPicker.value = data.paperColor;
                document.documentElement.style.setProperty('--paper-bg', data.paperColor);
            }
            if (data.lineOpacity != null && lineOpacitySlider) lineOpacitySlider.value = data.lineOpacity;
            if (data.lineNudge != null && lineNudgeInput) lineNudgeInput.value = data.lineNudge;
            if (data.pageNumberPos && pageNumberPos) pageNumberPos.value = data.pageNumberPos;
            if (data.scrollPos != null) restoredScrollTop = data.scrollPos;

            return true;
        } catch (e) {
            console.warn('Restore failed:', e);
            return false;
        }
    }

    // ───────────────────────────────────────────
    // KEYBOARD SHORTCUTS (in editor)
    // ───────────────────────────────────────────
    richEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                let node = sel.getRangeAt(0).startContainer;
                let cell = null;
                while (node && node !== richEditor) {
                    if (node.nodeType === 1 && (node.tagName === 'TD' || node.tagName === 'TH')) {
                        cell = node;
                        break;
                    }
                    node = node.parentNode;
                }

                if (cell) {
                    e.preventDefault();
                    // Inside table: handle cell navigation and row insertion
                    const row = cell.parentNode;
                    const table = row.closest('table');
                    const allCells = Array.from(table.querySelectorAll('td, th'));
                    const currentIndex = allCells.indexOf(cell);

                    if (e.shiftKey) {
                        // Move backward
                        if (currentIndex > 0) {
                            const prevCell = allCells[currentIndex - 1];
                            const range = document.createRange();
                            range.selectNodeContents(prevCell);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    } else {
                        // Move forward
                        if (currentIndex < allCells.length - 1) {
                            const nextCell = allCells[currentIndex + 1];
                            const range = document.createRange();
                            range.selectNodeContents(nextCell);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        } else {
                            // At the last cell -> automatically add a new row
                            const tbody = table.querySelector('tbody') || table;
                            const newRow = document.createElement('tr');
                            const cols = row.querySelectorAll('td, th').length;
                            for (let i = 0; i < cols; i++) {
                                const td = document.createElement('td');
                                td.innerHTML = '<br>';
                                newRow.appendChild(td);
                            }
                            tbody.appendChild(newRow);

                            // Move cursor to the first cell of the new row
                            const range = document.createRange();
                            range.selectNodeContents(newRow.firstChild);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);

                            triggerAutosave();
                            debouncedRender();
                        }
                    }
                    return; // Stop standard Tab behavior
                }
            }

            // Outside table: standard indent
            e.preventDefault();
            if (e.shiftKey) {
                document.execCommand('outdent', false, null);
            } else {
                document.execCommand('indent', false, null);
            }
            saveHistory();
            debouncedRender();
        }
    });

    // ───────────────────────────────────────────
    // DRAWING MODAL LOGIC
    // ───────────────────────────────────────────
    if (drawBtn && drawModal && drawCanvas) {
        const ctx = drawCanvas.getContext('2d');

        drawBtn.addEventListener('click', () => {
            saveSelection();
            drawModal.classList.add('active');
            if (ctx) {
                ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
                drawMode = 'pen';
                drawPen.classList.add('active');
                drawEraser.classList.remove('active');
            }
        });

        function closeDrawModal() {
            drawModal.classList.remove('active');
        }

        closeDrawModalBtn.addEventListener('click', closeDrawModal);
        cancelDrawBtn.addEventListener('click', closeDrawModal);

        insertDrawBtn.addEventListener('click', () => {
            if (ctx) {
                const dataURL = drawCanvas.toDataURL('image/png');
                const img = document.createElement('img');
                img.src = dataURL;
                img.style.maxWidth = '90%';
                img.style.maxHeight = '200px';
                img.style.display = 'block';
                img.style.margin = '8px auto';
                // Use mix-blend-mode to blend drawing naturally over paper lines/stains
                img.style.mixBlendMode = 'multiply';

                restoreSelection();
                richEditor.focus();
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    const range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(img);
                    range.collapse(false);
                } else {
                    richEditor.appendChild(img);
                }
                debouncedRender();
                showToast('Drawing/Signature inserted ✍️', 'success');
            }
            closeDrawModal();
        });

        function getMousePos(e) {
            const rect = drawCanvas.getBoundingClientRect();
            const scaleX = drawCanvas.width / rect.width;
            const scaleY = drawCanvas.height / rect.height;
            let clientX, clientY;

            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        function startDraw(e) {
            isDrawing = true;
            const pos = getMousePos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault(); // Prevent scrolling on touch
        }

        function mouseDraw(e) {
            if (!isDrawing) return;
            const pos = getMousePos(e);
            ctx.lineTo(pos.x, pos.y);

            if (drawMode === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = drawSize.value * 5;
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = drawColor.value;
                ctx.lineWidth = drawSize.value;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }

            ctx.stroke();
            e.preventDefault();
        }

        function stopDraw() {
            if (isDrawing) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.closePath();
                isDrawing = false;
            }
        }

        drawCanvas.addEventListener('mousedown', startDraw);
        drawCanvas.addEventListener('mousemove', mouseDraw);
        window.addEventListener('mouseup', stopDraw);

        drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
        drawCanvas.addEventListener('touchmove', mouseDraw, { passive: false });
        window.addEventListener('touchend', stopDraw);

        drawPen.addEventListener('click', () => {
            drawMode = 'pen';
            drawPen.classList.add('active');
            drawEraser.classList.remove('active');
        });

        drawEraser.addEventListener('click', () => {
            drawMode = 'eraser';
            drawEraser.classList.add('active');
            drawPen.classList.remove('active');
        });

        drawClear.addEventListener('click', () => {
            ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        });
    }

    // ───────────────────────────────────────────
    // SCROLL TRACKING — Update page info
    // ───────────────────────────────────────────
    scrollContainer.addEventListener('scroll', () => {
        if (totalPages <= 1) return;
        const scrollTop = scrollContainer.scrollTop;
        const pages = pagesContainer.querySelectorAll('.paper');
        let currentPage = 1;
        pages.forEach((pg, i) => {
            const rect = pg.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            if (rect.top < containerRect.top + containerRect.height / 2) {
                currentPage = i + 1;
            }
        });
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    });

    // ───────────────────────────────────────────
    // EXPERT HEADER SYNC & TEMPLATE LOGIC
    // ───────────────────────────────────────────
    function syncHeaderWithEditor() {
        const syncMap = {
            'sync-name': nameInput.value || 'John Doe',
            'sync-roll': rollInput.value || '2024CS101',
            'sync-class': classInput.value || 'CSE-A, Section B',
            'sync-date': dateInput.value || 'Today',
            'sync-subject': subjectInput.value || 'Data Structures',
            'sync-professor': professorInput.value || 'Prof. Alan Turing'
        };

        Object.keys(syncMap).forEach(id => {
            const elements = richEditor.querySelectorAll(`[id="${id}"], #${id}`);
            elements.forEach(el => {
                const val = syncMap[id];
                if (el.innerText !== val) {
                    el.innerText = val;
                }
            });
        });
    }

    // Event listeners are already handled by the first updateHeaderFields definition
    // which calls syncHeaderWithEditor() before rendering.

    function setupDefaultAssignment() {
        const t = TEMPLATES['assignment'];
        if (!t) return;
        paperStyleSelect.value = t.paperStyle;
        fontFamilySelect.value = t.fontFamily;
        richEditor.innerHTML = t.content;
        
        // Initial defaults for high-quality Look
        realismSlider.value = 45;
        inkVariationSlider.value = 35;
        lineSpacingSlider.value = 36;
        lineSpacingVal.textContent = '36px';
        
        updatePageSize();
        updateMargins();
        renderContent();
        triggerAutosave();
    }

    // Auto-Date functionality
    if (btnToday) {
        btnToday.addEventListener('click', () => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateInput.value = new Date().toLocaleDateString('en-US', options);
            updateHeaderFields();
        });
    }

    // TXT/MD Upload logic (Updated)
    if (uploadTxtBtn && txtFileInput) {
        uploadTxtBtn.addEventListener('click', () => txtFileInput.click());
        txtFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const text = ev.target.result;
                const paragraphs = text.split(/\n\s*\n/);
                const html = paragraphs.map(para => {
                    const reflowed = para.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                    return `<div>${reflowed}</div>`;
                }).filter(p => p !== '<div></div>').join('<div><br></div>');

                insertHTMLAtCursor(html);
                showToast('Text file imported ✨', 'success');
            };
            reader.readAsText(file);
            txtFileInput.value = '';
        });
    }

    // Speech Recognition (Dictation) logic
    if (dictateBtn) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            let isDictating = false;
            let finalTranscript = '';

            dictateBtn.addEventListener('click', () => {
                if (isDictating) {
                    recognition.stop();
                    return;
                }
                saveSelection();
                finalTranscript = '';
                recognition.start();
            });

            recognition.onstart = () => {
                isDictating = true;
                dictateBtn.classList.add('dictating-active');
                showToast('Listening... Speak now.', 'info', 2000);
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        restoreSelection();
                        finalTranscript += event.results[i][0].transcript + ' ';
                        // Format final text into editor immediately
                        insertHTMLAtCursor(event.results[i][0].transcript + ' ');
                        saveSelection(); // Update for next segment
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                showToast('Dictation error: ' + event.error, 'error');
                isDictating = false;
                dictateBtn.classList.remove('dictating-active');
            };

            recognition.onend = () => {
                isDictating = false;
                dictateBtn.classList.remove('dictating-active');
                showToast('Dictation ended.', 'info');
            };
        } else {
            dictateBtn.addEventListener('click', () => {
                showToast('Speech Recognition is not supported in this browser.', 'warning');
            });
        }
    }

    // ───────────────────────────────────────────
    // INITIALIZE
    // ───────────────────────────────────────────
    const restored = restoreFromLocalStorage();
    if (restored) {
        showToast('Previous work restored ✨', 'success', 2500);
    } else {
        setupDefaultAssignment();
        showToast('Assignment mode ready!', 'info', 2000);
    }

    // Initial page size & margins
    updatePageSize();
    updateMargins();
    
    // Auto-fit instead of forcing 100% on mobile
    if (isMobile) {
        autoFitZoom();
    } else {
        setTimeout(() => {
            setZoom(1.0);
        }, 150);
    }
    
    renderContent();

    console.log('🎨 NotebookGen v2.0 PRO — Ready!');
});
