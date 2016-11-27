echo "cleaning upload and output dirs"
rm -rf outputs/audio/*
rm -rf outputs/images/*

rm -rf inputs/audio/*
rm -rf inputs/images/*

rm -rf uploads/*
rm -rf albumArt/*

echo "dropping bobby tables"

printf "use synes-dev\ndb.songs.drop()" | mongo
