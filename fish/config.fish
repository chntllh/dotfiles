if status is-interactive
    # Commands to run in interactive sessions can go here
end

set fish_greeting

source ~/.config/fish/functions/aliases.fish

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
if test -f /home/aqua/anaconda3/bin/conda
    eval /home/aqua/anaconda3/bin/conda "shell.fish" "hook" $argv | source
else
    if test -f "/home/aqua/anaconda3/etc/fish/conf.d/conda.fish"
        . "/home/aqua/anaconda3/etc/fish/conf.d/conda.fish"
    else
        set -x PATH "/home/aqua/anaconda3/bin" $PATH
    end
end
# <<< conda initialize <<<

