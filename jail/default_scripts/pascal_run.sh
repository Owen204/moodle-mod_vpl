#!/bin/bash
# $Id: pascal_run.sh,v 1.6 2013-04-18 17:17:21 juanca Exp $
# Default Pascal language run script for VPL
# Copyright (C) 2012 Juan Carlos Rodríguez-del-Pino
# License http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
# Author Juan Carlos Rodríguez-del-Pino <jcrodriguez@dis.ulpgc.es>

#load common script and check programs
. common_script.sh
get_source_files pas p
#compile with gpc or fpc
PROPATH=$(command -v fpc 2>/dev/null)
if [ "$PROPATH" == "" ] ; then
	PROPATH=$(command -v gpc 2>/dev/null)
	if [ "$PROPATH" == "" ] ; then
		echo "The jail need to install "GNU Pascal" or "Fre PAscal" to run this type of program"
		exit 0;
	else
		gpc --automake -lm -ovpl_execution $SOURCE_FILES
	fi
else
	fpc -ovpl_execution $VPL_SUBFILE0
fi

