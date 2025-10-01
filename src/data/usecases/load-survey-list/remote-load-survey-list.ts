import { HttpStatusCode, type HttpGetClient } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { type LoadSurveyListModel, type LoadSurveyList } from '@/domain/usecases'

export type RemoteLoadSurveyListModel = {
  id: string
  question: string
  date: string
  didAnswer: boolean
}

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor (private readonly url: string, private readonly httpGetClient: HttpGetClient<RemoteLoadSurveyListModel[]>) {}

  async loadAll (): Promise<LoadSurveyListModel[]> {
    const httpResponse = await this.httpGetClient.get({ url: this.url })
    const remoteSurveys = httpResponse.body || []

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteSurveys.map(remoteSurvey => ({
        id: remoteSurvey.id,
        question: remoteSurvey.question,
        date: new Date(remoteSurvey.date),
        didAnswer: remoteSurvey.didAnswer
      }))
      case HttpStatusCode.noContent: return []
      default: throw new UnexpectedError()
    }
  }
}
