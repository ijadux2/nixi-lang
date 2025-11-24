" Nixi filetype detection for Vim
" Detect .nixi files as Nixi language

autocmd BufNewFile,BufRead *.nixi set filetype=nixi
autocmd BufNewFile,BufRead *.nix set filetype=nixi