<?php
//


namespace MikoPBX\Core\Asterisk\Configs;

use MikoPBX\Common\Models\SoundFiles;
use MikoPBX\Core\System\Util;

class ExtensionsAnnounceRecording extends CoreConfigClass
{
    /**
     * Генератор extensions, дополнительные контексты.
     * @return string
     */
    public function extensionGenContexts(): string
    {
        //
        return  '[annonce-spy]'. PHP_EOL.
                'exten => _.!,1,ExecIf($[ "${EXTEN}" == "h" ]?Hangup()'. PHP_EOL."\t".
	            'same => n,ExecIf($["${CHANNELS(PJSIP/${EXTEN})}x" != "x"]?Chanspy(PJSIP/${EXTEN},uBq))'. PHP_EOL."\t".
                'same => n,Hangup()'.PHP_EOL
                .PHP_EOL.
                '[annonce-playback-in]'.PHP_EOL.
                'exten => annonce,1,Answer()'.PHP_EOL."\t".
	            'same => n,ExecIf("${PBX_REC_ANNONCE_IN}x" != "x"]?Playback(${PBX_REC_ANNONCE_IN}))'.PHP_EOL."\t".
                'same => n,Hangup()'.PHP_EOL
                .PHP_EOL.
                '[annonce-playback-out]'.PHP_EOL.
                'exten => annonce,1,Answer()'.PHP_EOL."\t".
	            'same => n,ExecIf("${PBX_REC_ANNONCE_OUT}x" != "x"]?Playback(${PBX_REC_ANNONCE_OUT}))'.PHP_EOL."\t".
                'same => n,Hangup()'.PHP_EOL;
    }

    /**
     * Prepares additional parameters for [globals] section in the extensions.conf file

     * @param string $id
     * @return string
     */
    public static function getPathAnnonceFile(string $id): string
    {
        $filename        = '';
        if(!empty($id)){
            /** @var SoundFiles $fileData */
            $fileData = SoundFiles::findFirst($id);
            if($fileData){
                $filename = Util::trimExtensionForFile($fileData->path);
            }
        }
        return $filename;
    }

    /**
     * Prepares additional parameters for each outgoing route context
     * before dial call in the extensions.conf file
     *
     * @param array $rout
     *
     * @return string
     */
    public function generateOutRoutContext(array $rout): string
    {
        return 'same => n,Set(_OUT_NEED_ANNONCE=1)' . "\n\t";
    }

    /**
     * Prepares additional parameters for each incoming context for each incoming route before dial in the
     * extensions.conf file
     *
     * @param string $rout_number
     *
     * @return string
     */
    public function generateIncomingRoutBeforeDial(string $rout_number): string
    {
        return 'same => n,Set(IN_NEED_ANNONCE=1)' . "\n\t";
    }

}