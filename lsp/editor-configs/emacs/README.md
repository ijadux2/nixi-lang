# Nixi Language Support for Emacs

Emacs has excellent LSP support through `lsp-mode` and can use Nixi Language Server with proper configuration.

## Installation

### Prerequisites

1. **Emacs 26.1+** (for lsp-mode compatibility)
2. **Node.js 14+** (for running Nixi LSP server)
3. **Required Emacs packages**: `lsp-mode`, `company`, `flycheck`

### Quick Setup

1. **Copy configuration file**:
   ```bash
   cp lsp/editor-configs/emacs/nixi-mode.el ~/.emacs.d/lisp/
   ```

2. **Add to your init.el**:
   ```elisp
   (add-to-list 'load-path "~/.emacs.d/lisp")
   (require 'nixi-mode)
   (add-to-list 'auto-mode-alist '("\\.nixi\\'" . nixi-mode))
   ```

### Manual Package Installation

```elisp
;; Add to your init.el
(require 'package)
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/") t)
(package-initialize)

;; Install required packages
(unless (package-installed-p 'lsp-mode)
  (package-install 'lsp-mode))
(unless (package-installed-p 'company)
  (package-install 'company))
(unless (package-installed-p 'flycheck)
  (package-install 'flycheck))

;; Load Nixi mode
(load-file "~/.emacs.d/lisp/nixi-mode.el")
```

### Use-Package Configuration (Recommended)

```elisp
(use-package lsp-mode
  :ensure t
  :hook ((nixi-mode . lsp-deferred))
  :commands lsp lsp-deferred)

(use-package company
  :ensure t
  :hook (lsp-mode . company-mode)
  :config
  (setq company-idle-delay 0.1))

(use-package flycheck
  :ensure t
  :hook (lsp-mode . flycheck-mode))

;; Load Nixi mode
(use-package nixi-mode
  :load-path "~/.emacs.d/lisp/"
  :mode "\\.nixi\\'")
```

## Configuration

### Custom Settings

Add these settings to customize Nixi LSP behavior:

```elisp
;; LSP settings for Nixi
(setq lsp-nixi-settings
      '(:nixi (:server (:path . "/home/jadu/code/nixi/lsp/src/server.js")
                   :debug . nil)
                :completion (:enable . t
                           :trigger_characters . [" " "<" "{" "." ":" "(" "["])
                :diagnostics (:enable . t
                            :delay . 500)
                :hover (:enable . t)
                :definition (:enable . t)))

;; General LSP settings
(setq lsp-prefer-capf t
      lsp-completion-provider :capf
      lsp-idle-delay 0.1
      lsp-log-io nil
      lsp-auto-guess-root t)
```

### Company Mode Settings

```elisp
(with-eval-after-load 'company
  (setq company-tooltip-align-annotations t
        company-tooltip-limit 20
        company-idle-delay 0.1
        company-minimum-prefix-length 1
        company-show-numbers t)
  
  ;; Add Nixi-specific backends
  (defun nixi-company-backend ()
    "Company backend for Nixi."
    (set (make-local-variable 'company-backends)
          (append '(company-capf company-dabbrev) company-backends)))
  
  (add-hook 'nixi-mode-hook 'nixi-company-backend))
```

### Flycheck Settings

```elisp
(with-eval-after-load 'flycheck
  ;; Add Nixi-specific syntax checking
  (flycheck-define-checker nixi-lsp
    "Nixi LSP syntax checker."
    :command ("node" "/home/jadu/code/nixi/lsp/src/server.js" "--check" source)
    :error-patterns
    ((error line-start "Error at line " line ": " (message) line-end)
     (warning line-start "Warning at line " line ": " (message) line-end))
    :modes nixi-mode)
  
  (add-to-list 'flycheck-checkers 'nixi-lsp))
```

## Features

Once configured, Emacs provides:

### ✅ Core LSP Features
- **Syntax Highlighting** for all Nixi constructs
- **Code Completion** with Company mode (`C-M-i` or `TAB`)
- **Hover Documentation** (`C-h .` or mouse hover)
- **Goto Definition** (`M-.` or `C-c l d`)
- **Find References** (`C-c l r`)
- **Rename Symbol** (`C-c l r` for rename)
- **Error Diagnostics** with Flycheck
- **Code Actions** (`C-c l a`)

### ✅ Emacs-Specific Features
- **Ivy/Counsel Integration** for symbol search
- **Projectile Integration** for project-aware completion
- **Evil Mode Compatibility** for Vim users
- **Multiple Cursors Support**
- **Tree-sitter Integration** (when available)

## Key Bindings

### LSP Mode Bindings
| Key | Action |
|-----|--------|
| `C-c l d` | Go to definition |
| `C-c l D` | Go to type definition |
| `C-c l r` | Find references / rename |
| `C-c l a` | Code actions |
| `C-c l f` | Format buffer |
| `C-h .` | Hover documentation |
| `M-.` | Go to definition (alternate) |
| `M-,` | Return from definition |

### Company Mode Bindings
| Key | Action |
|-----|--------|
| `TAB` or `C-M-i` | Complete |
| `C-n` / `C-p` | Navigate candidates |
| `C-s` | Filter candidates |
| `F1` | Show documentation |
| `RET` | Accept completion |
| `C-w` | Accept word |

### Flycheck Bindings
| Key | Action |
|-----|--------|
| `C-c ! l` | List errors |
| `C-c ! n` | Next error |
| `C-c ! p` | Previous error |
| `C-c ! c` | Check current buffer |

## Advanced Configuration

### Tree-sitter Integration

```elisp
(use-package tree-sitter
  :ensure t
  :config
  (global-tree-sitter-mode)
  (add-hook 'nixi-mode-hook 'tree-sitter-hl-mode))

;; Install Nixi tree-sitter grammar
(use-package tree-sitter-langs
  :ensure t
  :config
  (tree-sitter-require 'nixi))
```

### Evil Mode Integration

```elisp
(use-package evil
  :ensure t
  :config
  (evil-mode 1))

;; Evil mode key bindings for LSP
(with-eval-after-load 'evil
  (evil-define-key 'normal 'nixi-mode-map
    "gd" 'lsp-find-definition
    "gD" 'lsp-find-declaration
    "gr" 'lsp-find-references
    "K" 'lsp-describe-thing-at-point
    "[d" 'flycheck-previous-error
    "]d" 'flycheck-next-error))
```

### Projectile Integration

```elisp
(use-package projectile
  :ensure t
  :config
  (projectile-mode 1)
  
  ;; Add Nixi files to projectile
  (add-to-list 'projectile-globally-ignored-files-suffix ".nixi")
  
  ;; Custom projectile command for Nixi projects
  (defun projectile-nixi-build ()
    "Build Nixi project."
    (interactive)
    (projectile-run-compilation "nixi build ."))
  
  (add-to-list 'projectile-compilation-cmds 'projectile-nixi-build))
```

## Troubleshooting

### LSP Not Starting

1. **Check Node.js**: `M-x shell-command RET node --version RET`
2. **Verify path**: Update server path in `nixi-mode.el`
3. **Check LSP logs**: `M-x lsp-trace-io`
4. **Test manually**: Run `node /path/to/server.js` in terminal

### No Completion

1. **Check Company**: `M-x company-diag`
2. **Verify LSP**: `M-x lsp-describe-session`
3. **Restart LSP**: `M-x lsp-restart-workspace`
4. **Check mode**: Ensure `nixi-mode` is active

### Syntax Highlighting Issues

1. **Check font-lock**: `M-x font-lock-debug-mode`
2. **Reload syntax**: `M-x font-lock-fontify-buffer`
3. **Verify mode**: `M-x describe-mode`

### Performance Issues

```elisp
;; Optimize for performance
(setq gc-cons-threshold 100000000
      read-process-output-max (* 1024 1024)
      lsp-log-io nil
      lsp-auto-guess-root t
      lsp-prefer-capf t)
```

### Debug Mode

```elisp
;; Enable debug logging
(setq lsp-log-io t
      lsp-print-io t
      lsp-trace nil) ; Set to 't' for full tracing
```

## Integration with Other Packages

### Counsel/Ivy

```elisp
(use-package counsel
  :ensure t
  :config
  ;; Use ivy for LSP symbol completion
  (setq lsp-completion-provider :none)
  (setcdr (assq 'company-capf company-backends)
          (lambda (command &rest args)
            (apply (cdr (assoc command nixi-ivy-completions)) args))))
```

### YASnippet Integration

```elisp
(use-package yasnippet
  :ensure t
  :config
  (yas-global-mode 1)
  
  ;; Add Nixi-specific snippets
  (yas-reload-all)
  (add-hook 'nixi-mode-hook 'yas-minor-mode))
```

### Magit Integration

```elisp
(use-package magit
  :ensure t
  :config
  ;; Add Nixi file support to magit
  (add-to-list 'magit-git-section-name-regexps "^\\.nixi$"))
```