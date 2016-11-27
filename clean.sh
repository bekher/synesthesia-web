echo "cleaning upload and output dirs"
rm -rf outputs/audio/*
rm -rf outputs/images/*

rm -rf inputs/audio/*
rm -rf inputs/images/*

rm -rf uploads/*
rm -rf albumArt/*
rm -rf imageUploads/*

echo "dropping bobby tables"

printf "use synes-dev\ndb.songs.drop()" | mongo
