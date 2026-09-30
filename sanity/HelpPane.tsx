import { Card, Container, Heading, Stack, Text } from '@sanity/ui'

const TACHES: { titre: string; image: string; etapes: string[] }[] = [
  { titre: 'Modifier en cliquant sur le site', image: 'presentation.png', etapes: [
    'Cliquez sur « Présentation » en haut de l’écran.',
    'Cliquez sur un texte ou une photo du site : le bon champ s’ouvre à côté.',
    'L’aperçu montre votre changement avant qu’il soit en ligne.',
    'Cliquez sur « Publier ».',
  ] },
  { titre: 'Changer un horaire ou un tarif', image: 'horaire.png', etapes: [
    'Menu « Programmes (horaires et tarifs) », puis le programme.',
    'Onglet « Groupes et horaires ». Écrivez comme l’exemple : « Samedi 09h00 à 10h00 ». Un avertissement jaune veut dire que la grille de la semaine ne comprend pas l’horaire : suivez l’exemple.',
    'Onglet « Tarifs » : un prix par colonne, dans le même ordre que les colonnes.',
    'Cliquez sur « Publier » : le site est à jour en moins d’une minute.',
  ] },
  { titre: 'Ajouter une nouvelle', image: 'nouvelle.png', etapes: [
    'Menu « Nouvelles », puis le bouton « + ».',
    'La saison est déjà remplie. Écrivez la date, le lieu, le titre et le texte.',
    'Le bouton « Médaille » ajoute une médaille d’or, d’argent ou de bronze dans la ligne.',
    'Glissez une photo directement dans le texte.',
    'Cliquez sur « Publier » : la nouvelle arrive en tête de sa saison.',
  ] },
  { titre: 'Ajouter un athlète', image: 'athlete.png', etapes: [
    'Menu « Athlètes », puis l’équipe (par exemple U16), puis « + » : l’équipe est déjà cochée.',
    'Écrivez le nom. Ajoutez des photos si l’athlète doit avoir sa propre page.',
    'Cliquez sur « Publier ». Pour retirer quelqu’un d’une équipe, décochez l’équipe et publiez.',
  ] },
  { titre: 'Changer une photo', image: 'photo.png', etapes: [
    'Ouvrez la fiche (ou « Photos du site » pour les photos d’ambiance).',
    'Glissez la nouvelle photo sur l’ancienne.',
    'Recadrage : placez le point sur le sujet pour qu’il reste visible sur téléphone.',
    'Écrivez la description en français et en anglais, puis cliquez sur « Publier ».',
  ] },
  { titre: 'Annuler une erreur', image: 'historique.png', etapes: [
    'Pas encore publié : menu « … » en bas, puis « Annuler les modifications ».',
    'Déjà publié : icône d’horloge en haut (historique), choisissez une version, « Restaurer », puis « Publier ».',
    'Fiche supprimée par erreur : écrivez à Yousif.',
  ] },
]

export function HelpPane() {
  return (
    <Container width={1} padding={4}>
      <Stack gap={5}>
        <Heading size={3}>Comment faire</Heading>
        <Text muted>
          Vos changements restent privés tant que vous n’avez pas cliqué sur « Publier ». S’il manque une information
          obligatoire, le bouton « Publier » est bloqué et le champ à corriger est indiqué en rouge.
        </Text>
        {TACHES.map(({ titre, image, etapes }) => (
          <Card key={titre} padding={4} radius={2} shadow={1}>
            <Stack gap={4}>
              <Heading size={1}>{titre}</Heading>
              {etapes.map((e, i) => <Text key={i}>{`${i + 1}. ${e}`}</Text>)}
              {/* eslint-disable-next-line @next/next/no-img-element -- Studio pane, not a site page */}
              <img src={`/studio-help/${image}`} alt={titre} style={{ width: '100%', borderRadius: 4 }}
                onError={e => (e.currentTarget.style.display = 'none')} />
            </Stack>
          </Card>
        ))}
        <Text muted size={1}>
          Les menus du site, les boutons et le design restent dans le code : pour les changer, demandez à Yousif.
        </Text>
      </Stack>
    </Container>
  )
}
