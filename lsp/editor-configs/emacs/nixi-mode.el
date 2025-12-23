;; Nixi Language Server configuration for Emacs with lsp-mode
;; Add this to your init.el or .emacs file

(use-package lsp-mode
  :ensure t
  :hook ((nixi-mode . lsp-deferred))
  :commands lsp lsp-deferred
  :config
  ;; Nixi LSP server configuration
  (lsp-register-client
   (make-lsp-client
    :new-connection (lsp-stdio-connection
                    '("node" "/home/jadu/code/nixi/lsp/src/server.js"))
    :major-modes '(nixi-mode)
    :server-id 'nixi-lsp
    :multi-root nil
    :initialization-options '((nixi . ((diagnostics . ((enable . t)))
                                   (completion . ((enable . t))))
                                   (hover . ((enable . t)))
                                   (definition . ((enable . t)))))
    :synchronize-sections '("nixi")
    :notification-handlers (lsp-ners-structures)
    :action-handlers (lsp-structures-action)
    :priority 1
    :add-on? t))
  
  ;; Custom settings for Nixi LSP
  (setq lsp-nixi-settings
        '(:nixi (:server (:path . "/home/jadu/code/nixi/lsp/src/server.js")
                     :debug . nil)
          :completion (:enable . t
                     :trigger_characters . [" " "<" "{" "." ":" "(" "["])
          :diagnostics (:enable . t
                      :delay . 500)
          :hover (:enable . t)
          :definition (:enable . t))))

;; Nixi major mode definition
(define-derived-mode nixi-mode prog-mode "Nixi"
  "Major mode for editing Nixi files."
  
  ;; Syntax highlighting (basic)
  (setq font-lock-defaults
        '(nixi-font-lock-keywords
          nil nil ((?_ . "w")) nil
          (font-lock-syntactic-face-function . nixi-syntactic-face-function)))
  
  ;; Set up comment syntax
  (set (make-local-variable 'comment-start) "# ")
  (set (make-local-variable 'comment-end) "")
  (set (make-local-variable 'comment-use-syntax) t)
  
  ;; indentation
  (set (make-local-variable 'indent-tabs-mode) nil)
  (set (make-local-variable 'tab-width) 2)
  (set (make-local-variable 'c-basic-offset) 2)
  (set (make-local-variable 'indent-line-function) 'nixi-indent-line)
  
  ;; Enable LSP mode
  (lsp-deferred))

;; Syntax highlighting keywords
(defvar nixi-font-lock-keywords
  `(
    ;; Keywords
    (,(regexp-opt '("let" "in" "if" "then" "else" "component" "style" "html" "css" "js"
                   "script" "link" "meta" "head" "body" "title" "header" "footer" "main"
                   "section" "article" "aside" "nav" "ul" "ol" "li" "table" "tr" "td"
                   "th" "thead" "tbody" "img" "video" "audio" "canvas" "svg" "form"
                   "label" "select" "option" "textarea" "iframe") 'words)
     . font-lock-keyword-face)
    
    ;; Constants
    (,(regexp-opt '("true" "false" "null") 'words)
     . font-lock-constant-face)
    
    ;; HTML tags
    ("<\\([a-zA-Z][a-zA-Z0-9]*\\)[^>]*>" 1 font-lock-function-name-face)
    ("</\\([a-zA-Z][a-zA-Z0-9]*\\)>" 1 font-lock-function-name-face)
    
    ;; CSS properties (basic)
    (,(regexp-opt '("color" "background-color" "font-size" "font-family" "font-weight"
                   "margin" "padding" "width" "height" "display" "position" "border"
                   "border-radius" "box-shadow" "text-align" "line-height") 'words)
     . font-lock-property-face)
    
    ;; Strings
    ("\"[^\"]*\"" . font-lock-string-face)
    ("'[^']*'" . font-lock-string-face)
    
    ;; Numbers
    ("\\_<[0-9]+\\(\\.[0-9]*\\)?\\_>" . font-lock-number-face)
    
    ;; Comments
    ("#.*$" . font-lock-comment-face)
    ("<!--.*-->" . font-lock-comment-face)
    )
  "Font lock keywords for Nixi mode.")

;; File extension association
(add-to-list 'auto-mode-alist '("\\.nixi\\'" . nixi-mode))

;; Basic indentation function
(defun nixi-indent-line ()
  "Indent current line in Nixi mode."
  (interactive)
  (let ((indent 0)
        (cur-pos (point)))
    (save-excursion
      (beginning-of-line)
      (when (re-search-backward "[{}()\\[\\]]" nil t)
        (cond
         ;; Opening braces increase indentation
         ((looking-at "[{\\[(]")
          (setq indent (+ (current-indentation) 2)))
         ;; Closing braces match opening
         ((looking-at "[}\\])")
          (setq indent (current-indentation)))
         ;; Default: copy indentation from previous line
         (t
          (setq indent (current-indentation))))))
    
    (indent-line-to indent)
    (when (> (point) cur-pos)
      (forward-to-indentation 0))))

;; Syntactic face function for better highlighting
(defun nixi-syntactic-face-function (state)
  "Return syntactic face for Nixi mode."
  (cond
   ((nth 3 state) 'font-lock-string-face)
   ((nth 4 state) 'font-lock-comment-face)
   (t nil)))

;; LSP mode integration
(with-eval-after-load 'lsp-mode
  (define-key lsp-mode-map (kbd "C-c l r") 'lsp-rename)
  (define-key lsp-mode-map (kbd "C-c l f") 'lsp-format-buffer)
  (define-key lsp-mode-map (kbd "C-c l a") 'lsp-execute-code-action))

;; Company mode integration for completion
(use-package company
  :ensure t
  :hook (lsp-mode . company-mode)
  :config
  (setq company-idle-delay 0.1
        company-minimum-prefix-length 1
        company-tooltip-align-annotations t))

;; Flycheck integration for diagnostics
(use-package flycheck
  :ensure t
  :hook (lsp-mode . flycheck-mode))

;; Nixi mode setup hook
(add-hook 'nixi-mode-hook
          (lambda ()
            (setq-local company-backends (append company-backends '(company-capf)))
            (setq-local flycheck-check-syntax-automatically '(save mode-enabled idle-change))
            (lsp)))

(provide 'nixi-mode)

;; Example usage in your init.el:
;; (require 'nixi-mode)
;; (add-hook 'nixi-mode-hook 'lsp)