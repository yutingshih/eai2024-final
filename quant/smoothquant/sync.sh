hostname=aislabnas.ee.ncku.edu.tw
port=222

script=$0
sync_dir=${2:-weights}
remote_dir=/Data-Weight/Llama/weights
local_dir=$(realpath $(dirname $script)/..)

upload() {
    src=$local_dir/$sync_dir
    dst=$remote_dir/$sync_dir
    printf "$hostname's account: " && read username
    sftp -P $port $username@$hostname <<< "put -r $src/* $dst"
}

download() {
    src=$remote_dir/$sync_dir
    dst=$local_dir/$sync_dir
    mkdir -p $dst
    printf "$hostname's account: " && read username
    sftp -P $port $username@$hostname <<< "get -r $src/* $dst"
}

help() {
    echo "
Usage: $script [-h|--help] COMMAND [PATH=$sync_dir]

- local directory to be sync  : $local_dir/$sync_dir
- remote directory to be sync : $remote_dir/$sync_dir

Commands:
    help                print this help message
    upload [PATH]       upload all the contents from local direcotry to remote directory
    download [PATH]     download all the contents from remote directory to local directory

Arguments:
    PATH                relative path to be synchronized between local storage and remote storage

Examples:
    $script download
        --> download files from \"$hostname:$remote_dir/$sync_dir\" to \"$local_dir/$sync_dir\"

    $script upload datasets
        --> upload files from \"$local_dir/datasets\" to \"$hostname:$remote_dir/datasets\"
"
}

case $1 in
    -h | --help | help)
        help
        ;;
    upload)
        upload
        ;;
    download)
        download
        ;;
    *)
        echo unknown command: $1
        help
        ;;
esac

